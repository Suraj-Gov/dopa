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
import CardsContainer from "../components/Containers/CardsContainer";
import RenderAnyEntity from "../components/RenderAnyEntity";

const Home: NextPage = () => {
  const getTrending = useQuery(
    ["trending"],
    async () => await axios.get<jioSaavnTypes.jsTrendingI>("/trending/all")
  );

  return (
    <>
      {getTrending.isLoading && <Spinner />}
      {getTrending.isSuccess && (
        <>
          <CardsContainer justifyItems={"center"}>
            {getTrending.data?.data?.new_trending?.map((i) => (
              <RenderAnyEntity entity={i} key={i.id} asCard />
            ))}
          </CardsContainer>
          <CardsContainer>
            {getTrending?.data?.data?.charts?.map((i) => (
              <RenderAnyEntity entity={i} key={i.id} />
            ))}
          </CardsContainer>
        </>
      )}
    </>
  );
};

export default Home;
