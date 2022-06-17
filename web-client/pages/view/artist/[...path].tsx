import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Image,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import React from "react";
import { GrMore } from "react-icons/gr";
import { useMutation, useQuery } from "react-query";
import {
  jsAlbumI,
  jsArtistI,
  jsBriefArtistsI,
} from "../../../../types/jioSaavn";
import AlbumCard from "../../../components/Cards/AlbumCard";
import ArtistCard from "../../../components/Cards/ArtistCard";
import SongCard from "../../../components/Cards/SongCard";
import CardsContainer from "../../../components/Containers/CardsContainer";
import SongCardsContainer from "../../../components/Containers/SongCardsContainer";
import RenderAnyEntity from "../../../components/RenderAnyEntity";

interface props {
  data: jsArtistI;
}

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  const path = ctx.params?.path as [string];
  const { query } = ctx;

  const [id] = path;

  if (!id) {
    return {
      notFound: true,
    };
  }

  const { data } = await axios.get<jsArtistI>(`/artist/${id}`, {
    params: query,
  });

  return {
    props: {
      data,
    } as props,
  };
};

const ArtistPage = ({ data }: props) => {
  const songsDisc = useDisclosure();
  const albumsDisc = useDisclosure();

  const getAlbumSongsQ = useMutation(
    [data],
    async (albumId: string) => await axios.get<jsAlbumI>(`/album/${albumId}`)
  );

  const getAlbumSongs = async (albumId: string) => {
    const { mutateAsync } = getAlbumSongsQ;
    const {
      data: { songs },
    } = await mutateAsync(albumId);
    return songs?.map((i) => i.id) ?? [];
  };

  return (
    <>
      <Box
        my="4"
        mt="8"
        display="flex"
        flexDir={"column"}
        alignItems={"center"}
      >
        <Image w="32" borderRadius={"full"} src={data.image} alt={data.name} />
        <Heading mt="4">{data.name}</Heading>
      </Box>
      {data.topSongs?.length && (
        <Box my="3">
          <Box>
            <Heading mb="4" as="h2" fontSize={"xl"}>
              Top Songs
            </Heading>
            <SongCardsContainer>
              {data.topSongs
                .slice(0, !songsDisc.isOpen ? 5 : undefined)
                .map((song) => (
                  <SongCard
                    key={song.id}
                    album={{
                      id: song.more_info?.album_id,
                      title: song.more_info?.album,
                    }}
                    artists={
                      song?.more_info?.artistMap?.artists as jsBriefArtistsI[]
                    }
                    imageUrl={song.image}
                    playbackId={song.id}
                    title={song.title}
                  />
                ))}
            </SongCardsContainer>
          </Box>
          <Center my="4">
            {!songsDisc.isOpen && (
              <Button variant={"outline"} flex={1} onClick={songsDisc.onOpen}>
                View more
              </Button>
            )}
          </Center>
          <Box mt="4">
            <Heading my="4" as="h2" fontSize={"xl"}>
              Albums by {data.name}
            </Heading>
            <CardsContainer>
              {data.topAlbums
                .slice(0, !albumsDisc.isOpen ? 5 : undefined)
                .map((a) => (
                  <AlbumCard
                    key={a.id}
                    albumSongs={() => getAlbumSongs(a.id)}
                    id={a.id}
                    image={a.image}
                    title={a.title}
                    artist={{
                      id: a.more_info?.artistMap.primary_artists[0].id,
                      title: a.more_info?.artistMap.primary_artists[0].name,
                      token: a.more_info?.artistMap.primary_artists[0].perma_url
                        .split("/")
                        .pop(),
                    }}
                  />
                ))}
            </CardsContainer>
            <Center my="4">
              {!albumsDisc.isOpen && (
                <Button
                  variant={"outline"}
                  flex={1}
                  onClick={albumsDisc.onOpen}
                >
                  View more
                </Button>
              )}
            </Center>
          </Box>
        </Box>
      )}
      {data.similarArtists.length && (
        <Box my="4">
          <Heading fontSize={"xl"} as="h3">
            Artists like {data.name}
          </Heading>
          <CardsContainer my="4">
            {data.similarArtists.map((a) => (
              <ArtistCard
                imageUrl={a.image_url}
                name={a.name}
                url={`/view/artist/${a.id}?token=${
                  a.perma_url?.split("/").pop() ?? ""
                }`}
                key={a.id}
              />
            ))}
          </CardsContainer>
        </Box>
      )}
    </>
  );
};

export default ArtistPage;
