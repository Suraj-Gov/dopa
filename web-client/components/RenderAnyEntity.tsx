import { Box, Center, Icon, IconButton, Text } from "@chakra-ui/react";
import Link from "next/link";
import React, { useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsAnyI, jsPlaylistI } from "../../types/jioSaavn";
import { playbackActions } from "../slices/playbackSlice";
import { playbackStoreStateT } from "../store";
import Card from "./BaseCard";
import SongCard from "./Cards/SongCard";
import { BiAlbum } from "react-icons/bi";
import { BsFillPersonFill, BsMusicNoteBeamed } from "react-icons/bs";
import { RiPlayListLine } from "react-icons/ri";
import { IconBaseProps } from "react-icons";
import EntityPlaybackButton from "./EntityPlaybackButton";
import { useQuery } from "react-query";
import axios from "axios";

interface props {
  entity: jsAnyI;
  asCard?: boolean;
}

const RenderAnyEntity: React.FC<props> = ({ entity, asCard }) => {
  const playbackState = useSelector(
    (state: playbackStoreStateT) => state.playback
  );
  const dispatch = useDispatch();

  const playlistSongsQuery = useQuery(
    [entity.type, entity.id],
    async () => await axios.get<jsPlaylistI>(`/playlist/${entity.id}`),
    {
      enabled: false,
    }
  );

  const playSongsInPlaylist = useCallback(async () => {
    const res = await playlistSongsQuery.refetch();
    const songs = res.data?.data.songs.map((i) => i.id) ?? [];
    dispatch(playbackActions.setQueue({ sourceId: entity.id, songs }));
    dispatch(playbackActions.unqueue());
  }, [dispatch, entity.id, playlistSongsQuery]);

  const render = useMemo(() => {
    switch (entity?.type) {
      case "song":
        return asCard ? (
          <Card
            overlayChildren={
              <>
                <Icon
                  m="2"
                  color="white"
                  size="1.2rem"
                  as={BsMusicNoteBeamed}
                />
                <EntityPlaybackButton
                  size="3rem"
                  sourceId={entity.id}
                  queueItems={[entity.id]}
                />
              </>
            }
            imageUrl={entity.image}
            key={entity.id}
          >
            <Text fontWeight={"bold"}>{entity.title}</Text>
          </Card>
        ) : (
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
        const albumSongs = entity.more_info?.song_pids?.split(", ") ?? [];

        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={
              <>
                <Icon m="2" size="1.2rem" color="white" as={BiAlbum} />
                {albumSongs && (
                  <EntityPlaybackButton
                    queueItems={albumSongs}
                    size="3rem"
                    sourceId={entity.id}
                  />
                )}
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
            <Link href={`/view/artist/${entity.music}`}>
              <a>
                <Text noOfLines={1} fontSize="sm">
                  {entity.music}
                </Text>
              </a>
            </Link>
          </Card>
        );
      }
      case "artist": {
        const artistId = entity.url?.split("/").pop();
        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={
              <Icon m="2" size="1.2rem" color="white" as={BsFillPersonFill} />
            }
            title={entity.title}
          >
            <Link href={`/view/artist/${entity.title}?token=${artistId}`}>
              <a>
                <Text noOfLines={2} fontWeight={700}>
                  {entity.title}
                </Text>
              </a>
            </Link>
          </Card>
        );
      }
      case "playlist": {
        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={
              <>
                <Icon m="2" size="1.2rem" color="white" as={RiPlayListLine} />
                <EntityPlaybackButton
                  size="3rem"
                  sourceId={entity.id}
                  onClick={playSongsInPlaylist}
                />
              </>
            }
            title={entity.title}
          >
            <Link href={`/view/playlist/${entity.id}`}>
              <a>
                <Text noOfLines={2} fontWeight={700}>
                  {entity.title}
                </Text>
              </a>
            </Link>
          </Card>
        );
      }
    }

    console.log("got nothing");

    return null;
  }, [entity, asCard, playSongsInPlaylist]);

  return render;
};

export default RenderAnyEntity;
