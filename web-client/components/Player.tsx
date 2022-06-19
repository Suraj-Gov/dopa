import {
  Box,
  Flex,
  HStack,
  IconButton,
  Image,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Spinner,
  Text,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { formatSeconds } from "../helpers";
import { MdSkipPrevious, MdSkipNext } from "react-icons/md";
import RTCContext from "./Context/RTCContext";
import { Player as PlayerType } from "../types";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { firebaseApp } from "../utils/firebaseClient";

const db = getFirestore(firebaseApp);

interface props {}

const controlButtonProps = {
  color: "black",
  sx: {
    _focus: {
      outline: "none",
      boxShadow: "none",
    },
    _active: {
      opacity: 1,
    },
    _hover: {
      opacity: 0.8,
    },
  },
  colorScheme: "blackAlpha",
  opacity: 0.6,
  background: "none",
};

// send playbackId, playbackTimestamp, isPlaying

const DEFAULT_POLLING_INTERVAL = 5_000;

const Player: React.FC<props> = () => {
  const [playbackUrl, setPlaybackUrl] = useState("");
  const [playbackTimestamp, setPlaybackTimestamp] = useState(0);
  const [canViewControls, setCanViewControls] = useState(false);
  const [isAudioLoaded, setIsAudioLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timer | null>();

  // timeouts are auto updated
  const updatePlaybackStatus = useCallback(
    (uid: string, playbackId: string, interval: number) => {
      const id = setTimeout(async () => {
        try {
          await setDoc(
            doc(db, "users", uid),
            {
              last_seen: new Date(),
              playback_id: playbackId,
            },
            { merge: true }
          );
          // if success, have a normal interval
          updatePlaybackStatus(uid, playbackId, DEFAULT_POLLING_INTERVAL);
        } catch (error) {
          console.error(error, `couldn't upsert user`);
          // backoff delay in case of error
          updatePlaybackStatus(uid, playbackId, interval + interval * 0.5);
        }
      }, interval);
      timeoutRef.current = id;
    },
    []
  );

  const iconColor = useColorModeValue("black", "white");
  controlButtonProps.color = iconColor;

  const playbackState = useSelector((state: storeStateT) => state.playback);
  const userState = useSelector((state: storeStateT) => state.user);
  const uid = userState?.user?.uid;
  const dispatch = useDispatch();

  const [isMobile] = useMediaQuery(["(max-width: 640px)"]);

  const playbackDetails = useQuery(
    ["playback", playbackState.current],
    async () => {
      setPlaybackTimestamp(0);
      return await axios.get<jsSongI>(`/song/${playbackState.current}`);
    },
    {
      enabled: !!playbackState.current,
      onSuccess: (res) => {
        setPlaybackUrl(res.data.encrypted_media_url);
      },
    }
  );

  const audioRef = useRef<HTMLAudioElement>(null);

  // TODO
  const playbackStreamData = JSON.stringify({
    id: playbackState.current,
    tz: playbackTimestamp,
    isPlaying: playbackState.isPlaying,
    uid,
  });

  useEffect(
    function longPollPlaybackStatus() {
      // do not update when not playing anything or has paused
      if (!uid || !playbackState.current || !playbackState.isPlaying) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = null;
        return;
      }
      // this will cancel the current timeout (if any) on any change in playback
      // and then trigger a timeout again
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      updatePlaybackStatus(
        uid,
        playbackState.current,
        DEFAULT_POLLING_INTERVAL
      );
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playbackState, uid]
  );

  useEffect(
    function setupListeners() {
      if (audioRef.current) {
        audioRef.current.onloadstart = () => setIsAudioLoaded(false);
        audioRef.current.onloadeddata = () => setIsAudioLoaded(true);
        if (playbackState.isPlaying) {
          setIsAudioLoaded(true);
          audioRef.current.play();
        } else {
          audioRef.current.pause();
        }
      }
    },
    [audioRef, dispatch, playbackState.isPlaying]
  );

  if (!playbackState.current) {
    return null;
  }

  const onPlaybackTimestampChange = (tz: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = tz;
      setPlaybackTimestamp(tz);
    }
  };

  const audioControls = {
    onPlay: () => dispatch(playbackActions.toggle(true)),
    onPause: () => dispatch(playbackActions.toggle(false)),
    onTimeUpdate: () =>
      setPlaybackTimestamp(audioRef.current?.currentTime ?? 0),
    goNext: () => dispatch(playbackActions.play({ offset: 1 })),
    goPrevious: () => dispatch(playbackActions.play({ offset: -1 })),
  };

  const playbackData = playbackDetails.data?.data;

  const artists = Object.entries(playbackData?.artistMap ?? {}).reduce(
    (fin, [name, id]) => {
      fin ??= [];
      fin.push({
        name,
        id: name,
      });
      return fin;
    },
    [] as any[]
  );

  const playerControls = (
    <Flex
      flexGrow={1}
      maxW="96"
      transition="all 0.3s ease"
      opacity={!isMobile || canViewControls ? 1 : 0}
      height={!isMobile || canViewControls ? "3rem" : "0"}
      pb={isMobile && canViewControls ? "4" : "0"}
      px={isMobile ? "2" : "0"}
      overflow={"hidden"}
      color="white"
      alignItems={"center"}
      justifyContent="space-between"
    >
      <IconButton
        {...controlButtonProps}
        aria-label="Play previous song"
        onClick={audioControls.goPrevious}
        icon={<MdSkipPrevious size="2rem" />}
      />
      <Text fontSize={"sm"} w="10">
        {formatSeconds(playbackTimestamp)}
      </Text>
      <Slider
        colorScheme={"red"}
        maxW="40"
        minW={"28"}
        value={playbackTimestamp}
        max={audioRef.current?.duration ?? 0}
        onChange={onPlaybackTimestampChange}
        aria-label="Playback Control"
      >
        <SliderTrack>
          <SliderFilledTrack />
        </SliderTrack>
        <SliderThumb />
      </Slider>
      <Text fontSize={"sm"} w="10" textAlign={"right"}>
        {formatSeconds(audioRef.current?.duration ?? 0)}
      </Text>
      <IconButton
        {...controlButtonProps}
        aria-label="Play next song"
        onClick={audioControls.goNext}
        icon={<MdSkipNext size={"2rem"} />}
      />
    </Flex>
  );

  return (
    <Flex
      zIndex={"2000"}
      position={"fixed"}
      left="0"
      right="0"
      bottom="4"
      mx="4"
      justifyContent={"stretch"}
    >
      <Flex
        bgColor={"blackAlpha.700"}
        borderRadius={"8"}
        flexGrow={1}
        flexDirection={"column"}
        color="white"
        sx={{ backdropFilter: "blur(4px) saturate(180%)" }}
        boxShadow={"lg"}
      >
        <Flex p="3">
          {playbackDetails.isLoading || playbackDetails.isFetching ? (
            <Box p="3">
              <Spinner />
            </Box>
          ) : (
            <Flex flexGrow={1} alignItems={"center"}>
              {isAudioLoaded ? (
                <Image
                  src={playbackData?.image}
                  alt={playbackData?.title}
                  boxSize="12"
                  borderRadius={"8"}
                />
              ) : (
                <Spinner size="lg" />
              )}
              <Flex
                flexGrow={1}
                justifyContent={"space-between"}
                alignItems="center"
              >
                <Flex flexDir={"column"} justifyContent="center" m="2" ml="4">
                  <Text noOfLines={2} fontWeight={"bold"}>
                    {playbackData?.song ?? playbackData?.title ?? "-"}
                  </Text>
                  <Text maxW={"96"} noOfLines={1} fontSize="sm">
                    <Link href={`/view/album/${playbackData?.albumid}`}>
                      <a>{playbackData?.album}</a>
                    </Link>
                  </Text>
                  {!isMobile && (
                    <Text maxW={"96"} noOfLines={1} fontSize={"xs"}>
                      <ArtistsLinks artists={artists} />
                    </Text>
                  )}
                </Flex>
                {!isMobile && playerControls}
                <Flex alignItems={"center"}>
                  <Box w="8" position="relative">
                    <EntityPlaybackButton
                      sourceId={playbackState.playSource ?? ""}
                      isSong
                      size={"2rem"}
                    />
                  </Box>
                  {isMobile && (
                    <IconButton
                      onClick={() => setCanViewControls((x) => !x)}
                      {...controlButtonProps}
                      aria-label="View more"
                      icon={<AiOutlineMore size={"2rem"} />}
                    />
                  )}
                </Flex>
              </Flex>
            </Flex>
          )}
        </Flex>
        {isMobile && playerControls}
      </Flex>
      <audio
        onLoad={() => dispatch(playbackActions.audioLoaded())}
        ref={audioRef}
        onPlay={audioControls.onPlay}
        onPause={audioControls.onPause}
        onTimeUpdate={audioControls.onTimeUpdate}
        onEnded={audioControls.goNext}
        autoPlay
        src={playbackUrl}
      ></audio>
    </Flex>
  );
};

export default Player;
