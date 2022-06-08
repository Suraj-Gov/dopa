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
    <SimpleGrid
      justifyItems={"center"}
      columns={[2, 3, 4]}
      spacing={[4, 8, 12]}
      {...rest}
    >
      {children}
    </SimpleGrid>
  );
};

export default CardsContainer;
