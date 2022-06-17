import { Box, chakra, Flex, Heading, Image, Text } from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext } from "next";
import Link from "next/link";
import React from "react";
import { jsAlbumI } from "../../../../types/jioSaavn";
import BaseCard from "../../../components/BaseCard";
import SongCard from "../../../components/Cards/SongCard";
import SongCardsContainer from "../../../components/Containers/SongCardsContainer";
import EntityPlaybackButton from "../../../components/EntityPlaybackButton";
import RenderAnyEntity from "../../../components/RenderAnyEntity";

interface props {
  data: jsAlbumI;
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

  const { data } = await axios.get<jsAlbumI>(`/album/${id}`);
  return {
    props: {
      data,
    } as props,
  };
};

const AlbumsPage: React.FC<props> = ({ data }) => {
  return (
    <Box my="6">
      <Flex>
        <BaseCard
          imageUrl={data.image}
          overlayChildren={
            <EntityPlaybackButton
              sourceId={data.id}
              queueItems={data.songs?.map((i) => i.id)}
            />
          }
        />
        <Flex ml="4" flexDir={"column"} justifyContent="flex-end">
          <Heading noOfLines={2} fontSize={"xl"} as="h1">
            {data.title}
          </Heading>
          <Text>
            <Link href={`/view/artist/${data.primary_artists}`}>
              <a>{data.primary_artists}</a>
            </Link>
            <chakra.span mx="2">&bull;</chakra.span>
            <chakra.span>{data.year}</chakra.span>
          </Text>
        </Flex>
      </Flex>
      <SongCardsContainer my="6">
        {data.songs?.map((s) => (
          <SongCard
            album={{ id: data.albumid, title: data.title }}
            artists={[
              { id: data.primary_artists_id, name: data.primary_artists },
            ]}
            imageUrl={s.image}
            playbackId={s.id}
            key={s.id}
            title={s.song}
          />
        ))}
      </SongCardsContainer>
    </Box>
  );
};

export default AlbumsPage;
