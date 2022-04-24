import { Center, Input, InputGroup, InputLeftElement } from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface props {}

const SearchBar: React.FC<props> = () => {
  const [searchStr, setSearchStr] = useState("");
  const [debouncedSearchStr] = useDebouncedValue(searchStr, 500);

  return (
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
  );
};

export default SearchBar;
