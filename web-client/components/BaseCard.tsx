import { Box, Text, Image } from "@chakra-ui/react";
import React from "react";

interface props {
  overlayChildren?: React.ReactNode;
  imageUrl: string;
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<props> = ({
  overlayChildren,
  imageUrl,
  children,
  title,
}) => {
  return (
    <Box
      width={["9rem", "8rem"]}
      borderRadius={"8px"}
      overflow="hidden"
      position={"relative"}
    >
      {overlayChildren && (
        <Box
          sx={{
            background:
              "linear-gradient(0deg, rgba(0,0,0,0) 50%, rgba(0,0,0,0.3) 100%)",
          }}
          pointerEvents="none"
          position="absolute"
          inset="0"
        />
      )}
      <Box position={"relative"}>
        <Box position={"absolute"} inset="0">
          {overlayChildren}
        </Box>
        <Image
          loading="lazy"
          cursor={"pointer"}
          borderRadius={"8px"}
          src={imageUrl}
          alt={title ?? "album art"}
        />
      </Box>
      <Box mt="2">{children}</Box>
    </Box>
  );
};

export default Card;
