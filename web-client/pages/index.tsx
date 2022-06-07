import { AiOutlineSearch } from "react-icons/ai";
import { useDebouncedValue } from "@mantine/hooks";
import type { NextPage } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { jioSaavnTypes } from "../types/jioSaavn";
import {
  Image,
  Text,
  Container,
  Center,
  SimpleGrid,
  Box,
  Stack,
  Input,
  InputGroup,
  InputLeftElement,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import Card from "../components/BaseCard";
import Link from "next/link";
import { resolveUrl, toNameCase } from "../helpers";

const Home: NextPage = () => {
  const getTrending = useQuery(
    ["trending"],
    async () => await axios.get<jioSaavnTypes.jsTrendingI>("/trending/all"),
    {
      onSuccess: ({ data }) => {
        console.log(data);
      },
    }
  );

  return (
    <>
      {getTrending.isLoading && <Spinner />}
      {getTrending.isSuccess && (
        <>
          <Heading size="md" my="4">
            Trending
          </Heading>
          <SimpleGrid columns={[2, 3, 4]} spacing={[4, 8, 12]}>
            {getTrending.data?.data?.new_trending?.map((i) => (
              <Card
                overlayChildren={
                  <Text m="2" color="white" size="sm">
                    {toNameCase(i.type)}
                  </Text>
                }
                imageUrl={i.image}
                onClick={() => {}}
                key={i.id}
              >
                <Link href={resolveUrl(i)}>
                  <a>
                    <Text fontWeight={"bold"}>{i.title}</Text>
                  </a>
                </Link>
              </Card>
            ))}
          </SimpleGrid>
          <Heading size="md" my="4">
            Chartbusters
          </Heading>
          <SimpleGrid columns={[2, 3, 4]} spacing={[4, 8, 12]}>
            {getTrending?.data?.data?.charts?.map((i) => (
              <Card key={i.id} imageUrl={i.image} onClick={() => {}}>
                <Link href={resolveUrl(i)}>
                  <a>
                    <Text fontWeight={"bold"}>{i.title}</Text>
                  </a>
                </Link>
              </Card>
            ))}
          </SimpleGrid>
        </>
      )}
    </>
  );
};

export default Home;
