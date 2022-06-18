import {
  Box,
  Center,
  Icon,
  IconButton,
  IconProps,
  Text,
} from "@chakra-ui/react";
import Link from "next/link";
import React, { useCallback, useContext, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { jsAnyI, jsPlaylistI } from "../../types/jioSaavn";
import { playbackActions } from "../slices/playbackSlice";
import { storeStateT } from "../store";
import Card from "./BaseCard";
import SongCard from "./Cards/SongCard";
import { BiAlbum } from "react-icons/bi";
import { BsFillPersonFill, BsMusicNoteBeamed } from "react-icons/bs";
import { RiPlayListLine } from "react-icons/ri";
import { IconBaseProps } from "react-icons";
import EntityPlaybackButton from "./EntityPlaybackButton";
import { useQuery } from "react-query";
import axios from "axios";
import { entityTypeIconProps } from "../constants";
import ArtistCard from "./Cards/ArtistCard";
import AlbumCard from "./Cards/AlbumCard";

interface props {
  entity: jsAnyI;
  asCard?: boolean;
}

const RenderAnyEntity: React.FC<props> = ({ entity, asCard }) => {
  const playbackState = useSelector((state: storeStateT) => state.playback);
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
                <Icon {...entityTypeIconProps} as={BsMusicNoteBeamed} />
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
              entity.more_info?.artistMap?.artists ?? [
                {
                  id: entity.primary_artists_id,
                  name: entity.primary_artists as string,
                },
              ]
            }
            imageUrl={entity.image}
            playbackId={entity.id}
            title={entity.title}
          />
        );
      case "album": {
        const albumSongs = entity.more_info?.song_pids?.split(", ") ?? [];

        return (
          <AlbumCard
            albumSongs={albumSongs}
            id={entity.id}
            image={entity.image}
            title={entity.title}
            artist={{
              id: entity.music ?? entity.primary_artists_id,
              title: entity.music ?? entity.primary_artists,
            }}
          />
        );
      }
      case "artist": {
        const artistId = entity.url?.split("/").pop();
        const artistUrl = `/view/artist/${entity.title}?token=${artistId}`;

        return (
          <ArtistCard
            imageUrl={entity.image}
            name={entity.name}
            url={artistUrl}
          />
        );
      }
      case "playlist": {
        return (
          <Card
            imageUrl={entity.image}
            overlayChildren={
              <>
                <Icon {...entityTypeIconProps} as={RiPlayListLine} />
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
