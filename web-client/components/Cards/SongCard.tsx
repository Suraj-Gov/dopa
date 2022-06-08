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
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import Link from "next/link";
import React, { useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playbackStoreStateT } from "../../store/index";
import { playbackActions } from "../../slices/playbackSlice";
import EntityPlaybackButton from "../EntityPlaybackButton";

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

  const artist = artists?.split(",").shift();

  return (
    <HStack {...rest}>
      <Box position={"relative"}>
        <Box position={"absolute"} display="grid" inset="0">
          <EntityPlaybackButton
            size="3rem"
            sourceId={playbackId}
            queueItems={[playbackId]}
          />
        </Box>
        <Image
          borderRadius={"4px"}
          width={["3rem", "4rem"]}
          src={imageUrl}
          alt={"album-art"}
        />
      </Box>
      <Box maxW={"13rem"}>
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
