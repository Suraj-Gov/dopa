import {
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Spinner,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface props extends InputProps {
  rightElement?: React.ReactNode;
  isLoading?: boolean;
}

const SearchBar: React.FC<props> = ({ rightElement, isLoading, ...rest }) => {
  return (
    <InputGroup
      background="whiteAlpha.800"
      my="4"
      sx={{ backdropFilter: "blur(2px) saturate(180%)" }}
      dropShadow="2xl"
      zIndex={"overlay"}
      top="4"
      position={"sticky"}
    >
      <InputLeftElement>
        {isLoading ? <Spinner w="4" h="4" /> : <AiOutlineSearch />}
      </InputLeftElement>
      <Input spellCheck={false} {...rest} />
      {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
    </InputGroup>
  );
};

export default SearchBar;
