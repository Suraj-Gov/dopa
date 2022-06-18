import {
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  Flex,
  HStack,
  IconButton,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { BiLogInCircle } from "react-icons/bi";
import { GrClose } from "react-icons/gr";
import { useQuery } from "react-query";
import { jsSearchResultsI } from "../../types/jioSaavn";
import { supabase } from "../pages/_app";
import AuthButton from "./AuthButton";
import SongCard from "./Cards/SongCard";
import CardsContainer from "./Containers/CardsContainer";
import SongCardsContainer from "./Containers/SongCardsContainer";
import RenderAnyEntity from "./RenderAnyEntity";
import SearchBar from "./SearchBar";

interface props {}

const Search: React.FC<props> = () => {
  const [searchQuery, setSearchStr] = useState("");
  const [debouncedSearchStr] = useDebouncedValue(searchQuery, 500);
  const searchDrawerDisc = useDisclosure();

  useEffect(() => {
    const signedInUser = supabase.auth.user();
    console.log(signedInUser);
  }, []);

  const searchResults = useQuery(
    [debouncedSearchStr, "search"],
    async () =>
      await axios.get<jsSearchResultsI>("/search/any", {
        params: { search: debouncedSearchStr },
      }),
    {
      enabled: Boolean(searchQuery),
    }
  );

  const renderSearchResults = useMemo(() => {
    if (searchResults.isSuccess && searchQuery) {
      const { albums, artists, playlists, songs, topquery } =
        searchResults.data.data;

      const topQuerySection = topquery?.data?.length && (
        <CardsContainer>
          {topquery.data.map((entity) => (
            <RenderAnyEntity key={entity.id} entity={entity} />
          ))}
        </CardsContainer>
      );

      const songsSection = songs?.data?.length && (
        <SongCardsContainer>
          {songs.data.map((s) => (
            <SongCard
              key={s.id}
              album={{ id: s.albumid, title: s.album }}
              artists={s.more_info?.artistMap?.artists ?? []}
              imageUrl={s.image}
              playbackId={s.id}
              title={s.title}
            />
          ))}
        </SongCardsContainer>
      );

      const artistsSection = artists?.data.length && (
        <CardsContainer>
          {artists.data.map((artist) => (
            <RenderAnyEntity key={artist.id} entity={artist} />
          ))}
        </CardsContainer>
      );

      const playlistsSection = playlists?.data.length && (
        <CardsContainer>
          {playlists.data.map((p) => (
            <RenderAnyEntity key={p.id} entity={p} />
          ))}
        </CardsContainer>
      );

      const albumsSection = albums?.data.length && (
        <CardsContainer>
          {albums.data.map((a) => (
            <RenderAnyEntity key={a.id} entity={a} />
          ))}
        </CardsContainer>
      );

      return (
        <Stack position={"relative"} spacing="6">
          {topQuerySection}
          {songsSection}
          {artistsSection}
          {playlistsSection}
          {albumsSection}
        </Stack>
      );
    }
    return (
      <Text textAlign={"center"}>
        Search for music, artists, albums and more!
      </Text>
    );
  }, [searchResults, searchQuery]);

  return (
    <>
      <Flex alignItems={"center"}>
        <SearchBar
          flexGrow={1}
          onClick={searchDrawerDisc.onOpen}
          value={searchQuery}
          onChange={({ target: { value } }) => setSearchStr(value)}
        />
        <AuthButton ml="3" aria-label="Login" />
      </Flex>
      <Drawer
        allowPinchZoom={false}
        returnFocusOnClose={false}
        placement="bottom"
        isOpen={searchDrawerDisc.isOpen}
        onClose={searchDrawerDisc.onClose}
        isFullHeight
      >
        <DrawerContent bgColor={"gray.100"} borderRadius="6">
          <DrawerBody px="4" pb="12">
            <Container position="relative" p="0" size="md">
              <SearchBar
                isLoading={searchResults.isLoading}
                rightElement={
                  <IconButton
                    border="none"
                    background="none"
                    aria-label="Close"
                    icon={<GrClose />}
                    onClick={searchDrawerDisc.onClose}
                  />
                }
                onClick={searchDrawerDisc.onOpen}
                value={searchQuery}
                onChange={({ target: { value } }) => setSearchStr(value)}
              />
              {renderSearchResults}
            </Container>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Search;
