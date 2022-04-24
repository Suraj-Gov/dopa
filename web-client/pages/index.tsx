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
} from "@chakra-ui/react";

const Home: NextPage = () => {
  const [searchStr, setSearchStr] = useState("");
  const [debouncedSearchStr] = useDebouncedValue(searchStr, 500);

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
      <Container p="xs" size="sm">
        <Center>
          <InputGroup my="4">
            <InputLeftElement>
              <AiOutlineSearch />
            </InputLeftElement>
            <Input
              value={searchStr}
              placeholder="What's on your mind?"
              onChange={(e) => setSearchStr(e.target.value)}
            />
          </InputGroup>
        </Center>

        <SimpleGrid columns={4} spacing="6">
          {getTrending.isSuccess &&
            getTrending.data?.data?.new_trending?.map((i) => (
              <Box
                width="8rem"
                borderRadius={"8px"}
                overflow="hidden"
                position={"relative"}
                key={i.id}
              >
                <Box
                  sx={{
                    background:
                      "linear-gradient(0deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)",
                  }}
                  position="absolute"
                  inset="0"
                />
                <Text
                  color="white"
                  position={"absolute"}
                  top="2"
                  left="2"
                  size="sm"
                >
                  {i.type}
                </Text>
                <Image borderRadius={"8px"} src={i.image} alt={i.title} />
                <Box mt="2">
                  <Text fontWeight={"bold"}>{i.title}</Text>
                </Box>
              </Box>
            ))}
        </SimpleGrid>
      </Container>
    </>
  );
};

export default Home;
