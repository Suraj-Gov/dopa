import {
  Center,
  Input,
  InputGroup,
  InputLeftElement,
  InputProps,
  InputRightElement,
  Spinner,
  useColorModeValue,
} from "@chakra-ui/react";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useState } from "react";
import { AiOutlineSearch } from "react-icons/ai";

interface props extends InputProps {
  rightElement?: React.ReactNode;
  isLoading?: boolean;
}

const SearchBar: React.FC<props> = ({ rightElement, isLoading, ...rest }) => {
  const bg = useColorModeValue("whiteAlpha.500", "blackAlpha.500");
  return (
    <InputGroup
      background={bg}
      sx={{ backdropFilter: "blur(2px) saturate(180%)" }}
      dropShadow="2xl"
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
