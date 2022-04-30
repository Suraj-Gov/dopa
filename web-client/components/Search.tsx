import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { jsAnyI, jsSearchResultsI } from "../../types/jioSaavn";
import { toNameCase, resolveUrl } from "../helpers";
import Card from "./Card";
import SearchBar from "./SearchBar";
import SongCard from "./SongCard";

interface props {}

const Search: React.FC<props> = () => {
  const [searchStr, setSearchStr] = useState("");
  const [debouncedSearchStr] = useDebouncedValue(searchStr, 500);

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

  const searchResultCategoryComponent = useMemo(() => {
    const searchResultData = searchResults.data?.data;

    if (!searchResultData) {
      return null;
    }

    const { shows: _shows, topquery, songs, ...rest } = searchResultData;

    return (
      <>
        {topquery && (
          // TODO /s/artist/<artist>
          <Box my="4">
            {topquery.data[0]?.type === "song" ? (
              <SongCard
                album={{ title: "", id: "" }}
                artists={topquery.data[0].more_info?.primary_artists ?? "-"}
                imageUrl={topquery.data[0].image}
                playbackId={topquery.data[0].id}
                title={topquery.data[0].title}
              />
            ) : (
              Boolean(topquery.data[0]) && (
                <Card
                  overlayChildren={
                    <Text color="white" m="2">
                      {toNameCase(topquery.data[0].type)}
                    </Text>
                  }
                  imageUrl={topquery.data[0].image}
                  onClick={() => {}}
                  title={topquery.data[0].title}
                >
                  <Link
                    href={`/view/${topquery.data[0]?.type}/${topquery.data[0].id}`}
                  >
                    <a>{topquery.data[0].title}</a>
                  </Link>
                </Card>
              )
            )}
          </Box>
        )}
        {Object.entries(rest).map(([title, v]) => {
          const { data } = v;
          if (!data?.length) {
            return null;
          }
          return (
            <>
              <Box my="6">
                <Heading mb="3" size="md">
                  {toNameCase(title)}
                </Heading>
                <SimpleGrid columns={[2, 3, 4]} spacing={[4, 8, 12]}>
                  {data.map((i: jsAnyI) => (
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
              </Box>
            </>
          );
        })}
      </>
    );
  }, [searchResults.data?.data]);

  return (
    <>
      <SearchBar
        value={searchStr}
        onChange={({ target: { value } }) => setSearchStr(value)}
      />

      {searchResults.isSuccess && (
        <>
          {searchResults.data?.data?.songs?.data.length && (
            <>
              {/* TODO albums undefined, add /s/<album> route */}
              <SimpleGrid columns={[1, 2]} spacing={[4, 6]}>
                {searchResults.data?.data.songs.data.map((i) => (
                  <SongCard
                    album={{ id: i.albumid, title: i.album }}
                    artists={i.primary_artists}
                    imageUrl={i.image}
                    playbackId={i.id}
                    title={i.title ?? i.song}
                    key={i.id}
                  />
                ))}
              </SimpleGrid>
              {searchResultCategoryComponent}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Search;
