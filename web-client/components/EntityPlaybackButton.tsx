import { Center, IconButton } from "@chakra-ui/react";
import React from "react";
import { BsPauseFill, BsPlayFill, BsPlay } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { playbackActions } from "../slices/playbackSlice";
import { playbackStoreStateT } from "../store";

interface props {
  queueItems: string[];
  sourceId: string;
  size?: string;
}

const EntityPlaybackButton: React.FC<props> = ({
  size,
  queueItems,
  sourceId,
}) => {
  const playbackState = useSelector(
    (state: playbackStoreStateT) => state.playback
  );
  const dispatch = useDispatch();

  const { isPlaying, playSource } = playbackState;
  const isCurrentSource = sourceId === playSource;

  const handleClick = () => {
    if (isCurrentSource) {
      dispatch(playbackActions.toggle());
    } else {
      dispatch(
        playbackActions.setQueue({
          songs: queueItems,
          sourceId,
        })
      );
      dispatch(playbackActions.unqueue());
    }
  };

  const interactionIcon = isCurrentSource ? (
    isPlaying ? (
      <BsPauseFill size={size} />
    ) : (
      <BsPlayFill size={size} />
    )
  ) : (
    <BsPlay size={size} />
  );

  return (
    <Center>
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
        }}
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
