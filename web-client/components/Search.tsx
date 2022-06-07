import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import axios from "axios";
import Link from "next/link";
import React, { useMemo, useState } from "react";
import { useQuery } from "react-query";
import { jsAnyI, jsSearchResultsI } from "../../types/jioSaavn";
import { toNameCase, resolveUrl } from "../helpers";
import Card from "./BaseCard";
import SearchBar from "./SearchBar";
import SongCard from "./Cards/SongCard";
import RenderAnyEntity from "./RenderAnyEntity";

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

  const renderSearchResults = useMemo(() => {
    if (searchResults.isSuccess) {
      const { albums, artists, playlists, songs, topquery } =
        searchResults.data.data;

      if (topquery && topquery.data.length) {
        const [entity] = topquery.data;
        return <RenderAnyEntity entity={entity} />;
      }
    }
    return null;
  }, [searchResults]);

  const searchResultCategoryComponent = useMemo(() => {
    const searchResultData = searchResults.data?.data;

    if (!searchResultData) {
      return null;
    }

    const {
      shows: _shows,
      topquery,
      songs,
      albums,
      artists,
      playlists,
    } = searchResultData;

    return <></>;
  }, [searchResults.data?.data]);

  return (
    <>
      <SearchBar
        value={searchStr}
        onChange={({ target: { value } }) => setSearchStr(value)}
      />
      {renderSearchResults}
    </>
  );
};

export default Search;
