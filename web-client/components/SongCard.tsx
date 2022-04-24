import { Box, HStack, Image, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

interface props {
  imageUrl: string;
  title: string;
  album: {
    title: string;
    id: string;
  };
  artists: string;
}

const SongCard: React.FC<props> = ({ album, artists, imageUrl, title }) => {
  const artist = artists.split(",").shift();

  return (
    <HStack>
      <Image
        borderRadius={"4px"}
        width={["3rem", "4rem"]}
        src={imageUrl}
        alt={"album-art"}
      />
      <Box>
        <Text
          whiteSpace={"nowrap"}
          overflow={"hidden"}
          fontWeight={"bold"}
          textOverflow="ellipsis"
        >
          {title}
        </Text>
        <Text fontSize={"sm"}>
          <Link href={`/album/${album.id}`}>
            <a>{album.title}</a>
          </Link>
        </Text>
        <Text fontSize={"xs"}>
          <Link href={`/artist/${artist}`}>
            <a>{artist}</a>
          </Link>
        </Text>
      </Box>
    </HStack>
  );
};

export default SongCard;
