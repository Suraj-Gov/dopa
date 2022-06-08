import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import React from "react";

interface props {
  children?: React.ReactNode;
}

const CardsContainer: React.FC<props & SimpleGridProps> = ({
  children,
  ...rest
}) => {
  return (
    <SimpleGrid minChildWidth={"8rem"} spacing={3} {...rest}>
      {children}
    </SimpleGrid>
  );
};

export default CardsContainer;
