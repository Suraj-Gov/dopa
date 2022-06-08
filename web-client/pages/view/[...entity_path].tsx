import {
  Box,
  Text,
  Container,
  HStack,
  Image,
  Heading,
  SimpleGrid,
  Center,
  Stack,
} from "@chakra-ui/react";
import axios from "axios";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import Link from "next/link";
import React, { useMemo } from "react";
import { jsAnyI, jsEntityType } from "../../../types/jioSaavn";
import Card from "../../components/BaseCard";
import SongCard from "../../components/Cards/SongCard";
import SongCardsContainer from "../../components/Containers/SongCardsContainer";
import { toNameCase } from "../../helpers";

interface props {
  data: jsAnyI;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const path = context.params?.entity_path as [jsEntityType, string];
  const query = context.query;
  if (!path || path.length < 2) {
    return {
      notFound: true,
    };
  }

  const [entityType, id] = path;
  const { data } = await axios.get<jsAnyI>(`/${entityType}/${id}`, {
    params: query,
  });

  return {
    props: {
      data,
    } as props,
  };
};

const EntityPage: React.FC<props> = ({ data }) => {
  const { type } = data;

  const renderContent = useMemo(() => {
    switch (type) {
      case "album":
        return (
          <>
            <SimpleGrid columns={[1, 2]} spacing={[4, 6]}>
              {data?.songs?.map((i) => (
                <SongCard
                  playbackId={i.id}
                  album={{ id: i.albumid, title: i.album }}
                  artists={i.primary_artists}
                  imageUrl={i.image}
                  title={i.song ?? i.title}
                  key={i.id}
                />
              ))}
            </SimpleGrid>
          </>
        );

      case "artist":
        return (
          <>
            <Image
              alt={data.name ?? data.title}
              borderRadius={"8px"}
              width="8rem"
              src={data.image}
            />
            <Stack spacing="8">
              {data?.topSongs && (
                <Box>
                  <Heading size="md" my="2">
                    Top Songs
                  </Heading>
                  <SimpleGrid columns={[1, 2]} spacing={[4, 6]}>
                    {data?.topSongs?.map((i) => (
                      <SongCard
                        playbackId={i.id}
                        key={i.id}
                        album={{ id: i.albumid, title: i.album }}
                        artists={i.primary_artists}
                        imageUrl={i.image}
                        title={i.song ?? i.title}
                      />
                    ))}
                  </SimpleGrid>
                  <SimpleGrid columns={[1, 2]} spacing={[4, 6]}>
                    {data?.singles?.map((i) => (
                      <SongCard
                        playbackId={i.id}
                        key={i.id}
                        album={{ id: i.albumid, title: i.album }}
                        artists={i.primary_artists}
                        imageUrl={i.image}
                        title={i.title}
                      />
                    ))}
                  </SimpleGrid>
                </Box>
              )}
              {data?.topAlbums && (
                <Box>
                  <Heading size="md" my="2">
                    Top Albums
                  </Heading>
                  <SimpleGrid columns={[1, 2]} spacing={[4, 6]}>
                    {data?.topAlbums?.map((i) => (
                      <Card
                        key={i.id}
                        imageUrl={i.image}
                        overlayChildren={
                          <Text color="white" m="2">
                            {i.year}
                          </Text>
                        }
                      >
                        <Link href={`/view/album/${i.albumid}`}>
                          <a>
                            <Text fontWeight={"bold"}>{i.name}</Text>
                          </a>
                        </Link>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
              {data?.similarArtists && (
                <Box>
                  <Heading size="md" my="2">
                    Similar Artists
                  </Heading>
                  <SimpleGrid columns={[1, 2]} spacing={[4, 6]}>
                    {data?.similarArtists?.map((i) => (
                      <Card key={i.id} imageUrl={i.image ?? i.image_url}>
                        <Link href={`/view/artist/${i.name}`}>
                          <a>
                            <Text fontWeight={"bold"}>{i.name}</Text>
                          </a>
                        </Link>
                      </Card>
                    ))}
                  </SimpleGrid>
                </Box>
              )}
            </Stack>
          </>
        );

      case "playlist":
        return (
          <>
            <SongCardsContainer>
              {(data.list ?? data.songs)?.map((i) => (
                <SongCard
                  playbackId={i.id}
                  key={i.id}
                  album={{ id: i.albumid, title: i.album }}
                  artists={i.primary_artists}
                  imageUrl={i.image}
                  title={i.title ?? i.song}
                />
              ))}
            </SongCardsContainer>
          </>
        );

      default:
        return null;
    }
  }, [data, type]);

  return (
    <>
      <Box my="4">
        {type === "artist" ? (
          <Heading size="md">{data.name}</Heading>
        ) : (
          <Heading size="md">{data.title}</Heading>
        )}
        <Text fontWeight={"light"}>{toNameCase(type)}</Text>
      </Box>
      {renderContent}
    </>
  );
};

export default EntityPage;
