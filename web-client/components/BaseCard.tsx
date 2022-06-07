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
      <Box position={"relative"}>
        {overlayChildren && (
          <>
            <Box zIndex={"6"} position={"absolute"} inset="0">
              {overlayChildren}
            </Box>
            <Box
              zIndex={"5"}
              sx={{
                background:
                  "linear-gradient(0deg, rgba(0,0,0,0) 20%, rgba(0,0,0,0.5) 100%)",
                opacity: 0.5,
              }}
              position="absolute"
              inset="0"
            />
          </>
        )}
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
