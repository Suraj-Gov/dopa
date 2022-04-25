import {
  Box,
  Button,
  ComponentWithAs,
  Flex,
  HStack,
  IconButton,
  Image,
  StackProps,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AiFillPlayCircle, AiFillPauseCircle } from "react-icons/ai";
import Link from "next/link";
import React, { useContext } from "react";
import PlaybackContext from "../context/playbackContext";

interface props {
  imageUrl: string;
  title: string;
  album: {
    title: string;
    id: string;
  };
  artists: string;
  playbackId: string;
}

const SongCard: React.FC<props & StackProps> = ({
  album,
  artists,
  imageUrl,
  title,
  playbackId,
  ...rest
}) => {
  const artist = artists?.split(",").shift();
  const {
    playbackContext: { isPlaying, playbackId: currentPlaybackId },
    setPlaybackContext,
  } = useContext(PlaybackContext);

  const handlePlayback = () => {
    if (currentPlaybackId !== playbackId) {
      setPlaybackContext({ isPlaying: true, playbackId });
    }
    if (isPlaying) {
      if (currentPlaybackId === playbackId) {
        setPlaybackContext((x) => ({ ...x, isPlaying: false }));
      } else {
        setPlaybackContext((x) => ({ ...x, playbackId }));
      }
    } else {
      setPlaybackContext((x) => ({ ...x, isPlaying: true }));
    }
  };

  return (
    <HStack {...rest}>
      <Box position={"relative"}>
        <IconButton
          sx={{
            opacity: "0",
            _hover: {
              opacity: "1",
            },
          }}
          top="2"
          left="2"
          position={"absolute"}
          size="lg"
          colorScheme="blackAlpha"
          icon={
            isPlaying && currentPlaybackId === playbackId ? (
              <AiFillPauseCircle size="32" />
            ) : (
              <AiFillPlayCircle size="32" />
            )
          }
          aria-label={"play"}
          onClick={handlePlayback}
        />
        <Image
          borderRadius={"4px"}
          width={["3rem", "4rem"]}
          src={imageUrl}
          alt={"album-art"}
        />
      </Box>
      <Box>
        <Text fontWeight={"bold"}>{title}</Text>
        <Text fontSize={"sm"}>
          <Link href={`/view/album/${album.id}`}>
            <a>{album.title}</a>
          </Link>
        </Text>
        <Text fontSize={"xs"}>
          <Link href={`/view/artist/${artist}`}>
            <a>{artist}</a>
          </Link>
        </Text>
      </Box>
    </HStack>
  );
};

export default SongCard;
