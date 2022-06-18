import { Icon, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React, { useCallback } from "react";
import { RiPlayListLine } from "react-icons/ri";
import { useQuery } from "react-query";
import { useDispatch, useSelector } from "react-redux";
import { jsPlaylistI } from "../../../types/jioSaavn";
import { entityTypeIconProps } from "../../constants";
import { playbackActions } from "../../slices/playbackSlice";
import { storeStateT } from "../../store";
import Card from "../BaseCard";
import EntityPlaybackButton from "../EntityPlaybackButton";

interface props {
  imageUrl: string;
  id: string;
  title: string;
}

const PlaylistCard: React.FC<props> = ({ imageUrl, id, title }) => {
  const playbackState = useSelector((state: storeStateT) => state.playback);
  const dispatch = useDispatch();

  const playlistSongsQuery = useQuery(
    [id],
    async () => await axios.get<jsPlaylistI>(`/playlist/${id}`),
    {
      enabled: false,
    }
  );

  const playSongsInPlaylist = useCallback(async () => {
    const res = await playlistSongsQuery.refetch();
    const songs = res.data?.data.songs.map((i) => i.id) ?? [];
    dispatch(playbackActions.setQueue({ sourceId: id, songs }));
    dispatch(playbackActions.unqueue());
  }, [dispatch, id, playlistSongsQuery]);

  return (
    <Card
      imageUrl={imageUrl}
      overlayChildren={
        <>
          <Icon {...entityTypeIconProps} as={RiPlayListLine} />
          <EntityPlaybackButton
            size="3rem"
            sourceId={id}
            onClick={playSongsInPlaylist}
          />
        </>
      }
      title={title}
    >
      <Link href={`/view/playlist/${id}`}>
        <a>
          <Text noOfLines={2} fontWeight={700}>
            {title}
          </Text>
        </a>
      </Link>
    </Card>
  );
};

export default PlaylistCard;
