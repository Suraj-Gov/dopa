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
import { jsArtistI, jsBriefArtistsI } from "../../../../types/jioSaavn";
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
                  <RenderAnyEntity entity={a} key={a.id} />
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
      {/* <pre>{JSON.stringify(data.topAlbums, null, 2)}</pre> */}
    </>
  );
};

export default ArtistPage;
