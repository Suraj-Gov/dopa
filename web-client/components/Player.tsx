import {
  Box,
  Flex,
  IconButton,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { jsSongI } from "../../types/jioSaavn";
import SongCard from "./Cards/SongCard";
import { useDispatch, useSelector } from "react-redux";
import { storeStateT } from "../store";
import { playbackActions } from "../slices/playbackSlice";
import Link from "next/link";
import ArtistsLinks from "./Elements/ArtistsLinks";
import EntityPlaybackButton from "./EntityPlaybackButton";
import { GrMore } from "react-icons/gr";
import { AiOutlineMore } from "react-icons/ai";

interface props {}

const Player: React.FC<props> = () => {
  const [playbackUrl, setPlaybackUrl] = useState("");
  const playbackState = useSelector((state: storeStateT) => state.playback);
  const dispatch = useDispatch();

  const [isMobile] = useMediaQuery(["(max-width: 640px)"]);

  const playbackDetails = useQuery(
    ["playback", playbackState.current],
    async () => await axios.get<jsSongI>(`/song/${playbackState.current}`),
    {
      enabled: !!playbackState.current,
      onSuccess: (res) => {
        setPlaybackUrl(res.data.encrypted_media_url);
      },
    }
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  /** setting up listeners */
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () => dispatch(playbackActions.toggle(true));
      audioRef.current.onpause = () => dispatch(playbackActions.toggle(false));
      if (playbackState.isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [dispatch, playbackState.isPlaying]);

  if (!playbackState.current) {
    return null;
  }

  const playbackData = playbackDetails.data?.data;
  console.log(playbackData);

  const artists = Object.entries(playbackData?.artistMap ?? {}).reduce(
    (fin, [name, id]) => {
      fin ??= [];
      fin.push({
        name,
        id,
      });
      return fin;
    },
    [] as any[]
  );

  return (
    <Flex justifyContent={"center"}>
      {playbackDetails.isLoading ? (
        <Spinner />
      ) : (
        <>
          <Box
            bgColor={"blackAlpha.700"}
            color="white"
            sx={{ backdropFilter: "blur(4px) saturate(180%)" }}
            boxShadow={"lg"}
            borderRadius={"8"}
            position={"fixed"}
            bottom="4"
            left="0"
            right="0"
            zIndex={"2000"}
            mx="4"
            p="3"
          >
            <Flex alignItems={"center"}>
              <Image
                src={playbackData?.image}
                alt={playbackData?.title}
                boxSize="12"
                borderRadius={"8"}
              />
              <Flex flexGrow={1} justifyContent={"space-between"}>
                <Flex flexDir={"column"} justifyContent="center" m="2">
                  <Text fontWeight={"bold"}>
                    {playbackData?.song ?? playbackData?.title ?? "-"}
                  </Text>
                  <Text noOfLines={1} fontSize="sm">
                    <Link href={`/view/album/${playbackData?.albumid}`}>
                      <a>{playbackData?.album}</a>
                    </Link>
                  </Text>
                  {/* <Text noOfLines={1} fontSize={"xs"}>
                  <ArtistsLinks artists={artists} />
                </Text> */}
                </Flex>
                <Flex alignItems={"center"}>
                  <Box w="8" position="relative">
                    <EntityPlaybackButton
                      sourceId={playbackState.playSource ?? ""}
                      isSong
                      size={"2rem"}
                    />
                  </Box>
                  <IconButton
                    colorScheme={"blackAlpha"}
                    opacity={0.6}
                    background="none"
                    aria-label="View more"
                    icon={<AiOutlineMore size={"2rem"} />}
                  />
                </Flex>
              </Flex>
            </Flex>
            {/* <Flex>
              <Slider aria-label="Playback Control">
                <SliderTrack>
                  <SliderFilledTrack />
                </SliderTrack>
                <SliderThumb />
              </Slider>
            </Flex> */}
          </Box>
          <audio ref={audioRef} autoPlay src={playbackUrl}></audio>
        </>
      )}
    </Flex>
  );
};

export default Player;
