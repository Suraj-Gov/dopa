import { Box, Center, Icon, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsAnyI } from "../../types/jioSaavn";
import { playbackActions } from "../slices/playbackSlice";
import { playbackStoreStateT } from "../store";
import Card from "./BaseCard";
import SongCard from "./Cards/SongCard";
import { BiAlbum } from "react-icons/bi";
import { IconBaseProps } from "react-icons";
import EntityPlaybackButton from "./EntityPlaybackButton";

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

        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={
              <>
                <Icon m="2" size="1.2rem" color="white" as={BiAlbum} />
                <EntityPlaybackButton
                  queueItems={albumSongs}
                  size="3rem"
                  sourceId={entity.id}
                />
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
  }, [entity]);

  return render;
};

export default RenderAnyEntity;
