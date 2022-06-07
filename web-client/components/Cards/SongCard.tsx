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
import { useDispatch, useSelector } from "react-redux";
import { playbackStoreStateT } from "../../store/index";
import { playbackActions } from "../../slices/playbackSlice";

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
  const playbackState = useSelector(
    (state: playbackStoreStateT) => state.playback
  );
  const dispatch = useDispatch();

  const handlePlayback = () => {
    if (playbackId !== playbackState.current) {
      dispatch(playbackActions.unqueue("PLAY_NOW"));
    } else {
      dispatch(playbackActions.toggle());
    }
  };

  const artist = artists?.split(",").shift();

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
            playbackState.current === playbackId ? (
              playbackState.isPlaying ? (
                <AiFillPauseCircle size="32" />
              ) : (
                <AiFillPlayCircle size="32" />
              )
            ) : undefined
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
        <Text noOfLines={1} fontWeight={"bold"}>
          {title}
        </Text>
        <Text noOfLines={1} fontSize={"sm"}>
          <Link href={`/view/album/${album.id}`}>
            <a>{album.title}</a>
          </Link>
        </Text>
        <Text noOfLines={1} fontSize={"xs"}>
          <Link href={`/view/artist/${artist}`}>
            <a>{artist}</a>
          </Link>
        </Text>
      </Box>
    </HStack>
  );
};

export default SongCard;
