import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import React from "react";

interface props {
  children?: React.ReactNode;
}

const SongCardsContainer: React.FC<props & SimpleGridProps> = ({
  children,
  ...rest
}) => {
  return (
    <SimpleGrid columns={[1, 2]} spacing={[4, 6]} {...rest}>
      {children}
    </SimpleGrid>
  );
};

export default SongCardsContainer;
