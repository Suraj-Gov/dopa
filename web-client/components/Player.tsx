import { Box, Flex, Spinner, Text } from "@chakra-ui/react";
import { useQuery } from "react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { jsSongI } from "../../types/jioSaavn";
import SongCard from "./SongCard";
import PlaybackContext from "../context/playbackContext";

interface props {}

const Player: React.FC<props> = () => {
  const {
    playbackContext: { isPlaying, playbackId },
    setPlaybackContext,
  } = useContext(PlaybackContext);
  const [playbackUrl, setPlaybackUrl] = useState("");

  const playbackDetails = useQuery(
    ["playback", playbackId],
    async () => await axios.get<jsSongI>(`/song/${playbackId}`),
    {
      enabled: !!playbackId,
      onSuccess: (res) => {
        setPlaybackUrl(res.data.encrypted_media_url);
      },
    }
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.onplay = () =>
        setPlaybackContext((x) => ({ ...x, isPlaying: true }));
      audioRef.current.onpause = () =>
        setPlaybackContext((x) => ({ ...x, isPlaying: false }));
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, setPlaybackContext]);

  if (!playbackId) {
    return null;
  }

  return (
    <Box
      borderRadius={"8"}
      position={"fixed"}
      bottom="4"
      background="white"
      p="4"
    >
      {playbackDetails.isLoading ? (
        <Spinner />
      ) : (
        <>
          <Flex alignItems={"center"}>
            <SongCard
              mr="4"
              album={{
                id: playbackDetails.data?.data.albumid ?? "-",
                title: playbackDetails.data?.data?.album ?? "-",
              }}
              artists={playbackDetails.data?.data.primary_artists ?? "-"}
              imageUrl={playbackDetails.data?.data.image!}
              playbackId={playbackId}
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
