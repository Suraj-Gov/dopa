import { Center, IconButton, Spinner } from "@chakra-ui/react";
import React, { useState } from "react";
import { BsPauseFill, BsPlayFill, BsPlay } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { playbackActions } from "../slices/playbackSlice";
import { storeStateT } from "../store";

interface props {
  queueItems?: string[] | (() => Promise<string[]>);
  onClick?: () => void;
  sourceId: string;
  size?: string;
  isSong?: boolean;
}

const EntityPlaybackButton: React.FC<props> = ({
  size,
  queueItems,
  sourceId,
  onClick,
  isSong,
}) => {
  const playbackState = useSelector((state: storeStateT) => state.playback);
  const dispatch = useDispatch();

  const { isPlaying, playSource } = playbackState;
  const isCurrentSource = sourceId === playSource;

  const [isLoading, setIsLoading] = useState(false);

  const handleClick = async () => {
    if (isCurrentSource) {
      dispatch(playbackActions.toggle());
    } else {
      if (queueItems) {
        let songs: string[];
        if (typeof queueItems === "function") {
          setIsLoading(true);
          songs = await queueItems();
          setIsLoading(false);
        } else {
          songs = queueItems;
        }
        dispatch(
          playbackActions.setQueue({
            songs: songs,
            sourceId,
          })
        );
        dispatch(playbackActions.play());
      } else if (onClick) {
        onClick();
      }
    }
  };

  const interactionIcon = isCurrentSource ? (
    isPlaying ? (
      <BsPauseFill size={size} />
    ) : (
      <BsPlayFill size={size} />
    )
  ) : isLoading ? (
    <Spinner size="lg" thickness="4px" />
  ) : (
    <BsPlay size={size} />
  );

  const boxSize = isSong ? ["3rem", "4rem"] : ["9rem", "8rem"];

  return (
    <Center position={"absolute"} inset="0">
      <IconButton
        mixBlendMode={"lighten"}
        sx={{
          opacity: isCurrentSource ? 0.6 : 0,
          _hover: {
            outline: "none",
            opacity: 0.85,
          },
          _focus: {
            border: "none",
            boxShadow: "none",
          },
          touchAction: "manipulation",
        }}
        boxSize={boxSize}
        background="none"
        onClick={handleClick}
        color="white"
        icon={interactionIcon}
        aria-label={isPlaying ? "Pause" : "Play"}
      />
    </Center>
  );
};

export default EntityPlaybackButton;
