import { Box, Center, Icon, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsAnyI } from "../../types/jioSaavn";
import { playbackActions } from "../slices/playbackSlice";
import { playbackStoreStateT } from "../store";
import Card from "./BaseCard";
import SongCard from "./Cards/SongCard";
import { BsPauseFill, BsPlay, BsPlayFill } from "react-icons/bs";
import { IconBaseProps } from "react-icons";

interface props {
  entity?: jsAnyI;
}

const RenderAnyEntity: React.FC<props> = ({ entity }) => {
  const playbackState = useSelector(
    (state: playbackStoreStateT) => state.playback
  );
  const dispatch = useDispatch();

  const render = useMemo(() => {
    switch (entity?.type) {
      case "song":
        return (
          <SongCard
            album={{ id: entity.albumid, title: entity.album }}
            artists={
              entity.more_info?.primary_artists ?? entity.primary_artists
            }
            imageUrl={entity.image}
            playbackId={entity.id}
            title={entity.title}
          />
        );
      case "album": {
        const albumSongs = entity.more_info?.song_pids.split(", ") ?? [];
        const isCurrentSource = playbackState.playSource === entity.id;
        const { isPlaying } = playbackState;

        const interactionIcon = isCurrentSource ? (
          isPlaying ? (
            <BsPauseFill size="3rem" />
          ) : (
            <BsPlayFill size="3rem" />
          )
        ) : (
          <BsPlay size="3rem" />
        );

        const handleClick = () => {
          if (isCurrentSource) {
            dispatch(playbackActions.toggle());
          } else {
            dispatch(
              playbackActions.setQueue({
                songs: albumSongs,
                sourceId: entity.id,
              })
            );
            dispatch(playbackActions.unqueue(true));
          }
        };

        const interaction = (
          <Center>
            <IconButton
              sx={{
                opacity: 0.4,
                _hover: {
                  boxShadow: "none",
                  outline: "none",
                  opacity: 0.75,
                },
              }}
              border="none"
              background={"none"}
              onClick={handleClick}
              color="white"
              icon={interactionIcon}
              aria-label={isPlaying ? "Pause" : "Play"}
            />
          </Center>
        );

        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={
              <>
                <Text m="2" color="white">
                  Album
                </Text>
                {interaction}
              </>
            }
            title={entity.title}
          >
            <Link href={`/view/album/${entity.id}`}>
              <a>
                <Text noOfLines={2} fontWeight={700}>
                  {entity.title}
                </Text>
              </a>
            </Link>
          </Card>
        );
      }
      case "artist":
        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={<Text>Artist</Text>}
            title={entity.title}
          >
            {null}
          </Card>
        );
      case "playlist":
        return <Text>Playlist</Text>;
    }

    console.log("got nothing");

    return <>JSON.stringify(entity)</>;
  }, [entity, dispatch, playbackState]);

  return render;
};

export default RenderAnyEntity;
