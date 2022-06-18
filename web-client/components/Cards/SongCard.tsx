import {
  Box,
  Button,
  chakra,
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
import { storeStateT } from "../../store/index";
import { playbackActions } from "../../slices/playbackSlice";
import EntityPlaybackButton from "../EntityPlaybackButton";
import ArtistsLinks, { ArtistsLinksProps } from "../Elements/ArtistsLinks";
interface props {
  imageUrl: string;
  title: string;
  album: {
    title?: string;
    id?: string;
  };
  playbackId: string;
}

const SongCard: React.FC<props & StackProps & ArtistsLinksProps> = ({
  album,
  artists,
  imageUrl,
  title,
  playbackId,
  ...rest
}) => {
  return (
    <HStack {...rest}>
      <Box position={"relative"}>
        <Box position={"absolute"} display="grid" inset="0">
          <EntityPlaybackButton
            size="3rem"
            sourceId={playbackId}
            queueItems={[playbackId]}
            isSong
          />
        </Box>
        <Image
          borderRadius={"4px"}
          width={["4rem", "5rem"]}
          src={imageUrl}
          alt={"album-art"}
        />
      </Box>
      <Box maxW={["16rem", "12rem"]}>
        <Text noOfLines={1} fontWeight={"bold"}>
          {title}
        </Text>
        {album.id && album.title && (
          <Text noOfLines={1} fontSize={"sm"}>
            <Link href={`/view/album/${album.id}`}>
              <a>{album.title}</a>
            </Link>
          </Text>
        )}
        <Text noOfLines={1} fontSize={"xs"}>
          <ArtistsLinks artists={artists} />
        </Text>
      </Box>
    </HStack>
  );
};

export default SongCard;
