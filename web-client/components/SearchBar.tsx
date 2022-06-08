import {
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface props extends InputProps {
  rightElement?: React.ReactNode;
}

const SearchBar: React.FC<props> = ({ rightElement, ...rest }) => {
  return (
    <Center
      background="whiteAlpha.800"
      my="4"
      sx={{ backdropFilter: "blur(2px) saturate(180%)" }}
      dropShadow="2xl"
      zIndex={"overlay"}
      top="4"
      position={"sticky"}
    >
      <InputGroup>
        <InputLeftElement>
          <AiOutlineSearch />
        </InputLeftElement>
        <Input {...rest} />
        {rightElement && <InputRightElement>{rightElement}</InputRightElement>}
      </InputGroup>
    </Center>
  );
};

export default SearchBar;
