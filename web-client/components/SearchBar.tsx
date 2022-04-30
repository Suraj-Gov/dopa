import {
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface props extends InputProps {}

const SearchBar: React.FC<props> = (props) => {
  return (
    <Center>
      <InputGroup my="4">
        <InputLeftElement>
          <AiOutlineSearch />
        </InputLeftElement>
        <Input {...props} />
      </InputGroup>
    </Center>
  );
};

export default SearchBar;
