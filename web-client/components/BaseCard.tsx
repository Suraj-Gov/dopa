import { Box, Text, Image } from "@chakra-ui/react";
import Link from "next/link";
import React, { memo } from "react";

interface props {
  overlayChildren?: React.ReactNode;
  imageUrl: string;
  children?: React.ReactNode;
  title?: string;
  url?: string;
}

const Card: React.FC<props> = ({
  overlayChildren,
  imageUrl,
  children,
  title,
  url,
}) => {
  const CardImage = (
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
                "linear-gradient(-45deg, rgba(0,0,0,0) 60%, rgba(0,0,0,0.7) 100%)",
              opacity: 0.5,
            }}
            position="absolute"
            inset="0"
          />
        </>
      )}
      <Image
        boxSize={"36"}
        backgroundColor={"gray"}
        loading="lazy"
        cursor={"pointer"}
        borderRadius={"8px"}
        src={imageUrl}
        alt={title ?? "album art"}
      />
    </Box>
  );

  return (
    <Box
      width={["9rem", "8rem"]}
      borderRadius={"8px"}
      overflow="hidden"
      position={"relative"}
    >
      {url ? (
        <Link href={url}>
          <a>{CardImage}</a>
        </Link>
      ) : (
        CardImage
      )}
      <Box mt="2">{children}</Box>
    </Box>
  );
};

export default memo(Card);
