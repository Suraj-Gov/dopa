import {
  Box,
  Center,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  Flex,
  Heading,
  HStack,
  IconButton,
  SimpleGrid,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { jsAnyI, jsSearchResultsI } from "../../types/jioSaavn";
import { toNameCase, resolveUrl } from "../helpers";
import Card from "./BaseCard";
import SearchBar from "./SearchBar";
import SongCard from "./Cards/SongCard";
import RenderAnyEntity from "./RenderAnyEntity";
import CardsContainer from "./Containers/CardsContainer";
import SongCardsContainer from "./Containers/SongCardsContainer";
import { GrClose } from "react-icons/gr";

interface props {}

const Search: React.FC<props> = () => {
  const [searchStr, setSearchStr] = useState("");
  const [debouncedSearchStr] = useDebouncedValue(searchStr, 500);
  const searchDrawerDisc = useDisclosure();

  const searchResults = useQuery(
    [debouncedSearchStr, "search"],
    async () =>
      await axios.get<jsSearchResultsI>("/search/any", {
        params: { search: debouncedSearchStr },
      }),
    {
      enabled: Boolean(searchStr),
    }
  );

  const renderSearchResults = useMemo(() => {
    if (searchResults.isSuccess) {
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
              artists={s.more_info?.primary_artists ?? s.primary_artists}
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
    return null;
  }, [searchResults]);

  return (
    <>
      <SearchBar
        onClick={searchDrawerDisc.onOpen}
        value={searchStr}
        onChange={({ target: { value } }) => setSearchStr(value)}
      />
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
                value={searchStr}
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
