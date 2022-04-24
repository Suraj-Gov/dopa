import { AiOutlineSearch } from "react-icons/ai";
import {
  Text,
  Box,
  Center,
  Container,
  Group,
  Image,
  LoadingOverlay,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import type { NextPage } from "next";
import { useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { jioSaavnTypes } from "../types/jioSaavn";

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
          <TextInput
            icon={<AiOutlineSearch />}
            label="Search"
            value={searchStr}
            onChange={(e) => setSearchStr(e.target.value)}
          />
        </Center>
        <LoadingOverlay visible={getTrending.isLoading} />
        <Box>
          {getTrending.isSuccess &&
            getTrending.data?.data?.new_trending?.map((i) => (
              <Group key={i.id}>
                <Image width={"5rem"} src={i.image} alt={i.title} />
                <Stack>
                  <Text weight={700}>{i.title}</Text>
                  <Text size="sm">{i.type}</Text>
                </Stack>
              </Group>
            ))}
        </Box>
      </Container>
    </>
  );
};

export default Home;
