import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerContent,
  Flex,
  HStack,
  IconButton,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import { useRouter } from "next/router";
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

  const router = useRouter();
  router.events?.on("routeChangeComplete", searchDrawerDisc.onClose);

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
        <Flex justifyContent={"center"} boxShadow={"xl"} p="3">
          {topquery.data.map((entity) => (
            <RenderAnyEntity key={entity.id} entity={entity} />
          ))}
        </Flex>
      );

      const songsSectionArtists = songs?.data
        .map((s) => s.more_info?.primary_artists as string)
        .map((artists) =>
          artists.split(", ").map((a) => ({
            id: a,
            name: a,
          }))
        );

      const songsSection = songs?.data?.length && (
        <SongCardsContainer>
          {songs.data.map((s, idx) => (
            <SongCard
              key={s.id}
              album={{ id: s.albumid, title: s.album }}
              artists={songsSectionArtists[idx] ?? []}
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
        <>
          <Spacer h="2rem" />
          <Stack position={"relative"} spacing="6">
            {topQuerySection}
            {songsSection}
            {artistsSection}
            {playlistsSection}
            {albumsSection}
          </Stack>
        </>
      );
    }
    return (
      <Text mt="8" textAlign={"center"}>
        Search for music, artists, albums and more!
      </Text>
    );
  }, [searchResults, searchQuery]);

  return (
    <>
      <Flex
        zIndex={"overlay"}
        top="4"
        position={"sticky"}
        alignItems={"center"}
      >
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
              <Box zIndex={"overlay"} top="4" position={"sticky"}>
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
                  value={searchQuery}
                  onChange={({ target: { value } }) => setSearchStr(value)}
                />
              </Box>
              {renderSearchResults}
            </Container>
            <Spacer h="8rem" />
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default Search;
