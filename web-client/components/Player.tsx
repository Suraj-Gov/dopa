import { Box, Flex, Spinner, Text, useMediaQuery } from "@chakra-ui/react";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { jsSongI } from "../../types/jioSaavn";
import SongCard from "./Cards/SongCard";
import { useDispatch, useSelector } from "react-redux";
import { storeStateT } from "../store";
import { playbackActions } from "../slices/playbackSlice";

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

  return (
    <Box
      borderRadius={"8"}
      position={"fixed"}
      bottom="4"
      zIndex={"2000"}
      background="white"
      p="4"
    >
      {playbackDetails.isLoading ? (
        <Spinner />
      ) : (
        <>
          <Flex flexDir={isMobile ? "column" : "row"} alignItems={"center"}>
            <SongCard
              mr="4"
              album={{
                id: playbackDetails.data?.data.albumid ?? "-",
                title: playbackDetails.data?.data?.album ?? "-",
              }}
              artists={playbackDetails.data?.data.artistMap?.artists ?? []}
              imageUrl={playbackDetails.data?.data.image!}
              playbackId={playbackState.current}
              title={
                playbackDetails.data?.data.song ??
                playbackDetails.data?.data.title ??
                "-"
              }
            />
            <audio ref={audioRef} autoPlay src={playbackUrl} controls></audio>
          </Flex>
        </>
      )}
    </Box>
  );
};

export default Player;
