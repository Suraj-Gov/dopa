import { Icon, Text } from "@chakra-ui/react";
import axios from "axios";
import Link from "next/link";
import React from "react";
import { BiAlbum } from "react-icons/bi";
import { useMutation, useQuery } from "react-query";
import { jsAlbumI } from "../../../types/jioSaavn";
import { entityTypeIconProps } from "../../constants";
import Card from "../BaseCard";
import EntityPlaybackButton from "../EntityPlaybackButton";

interface props {
  albumSongs?: string[] | (() => Promise<string[]>);
  image: string;
  id: string;
  title: string;
  artist?: {
    id?: string;
    title?: string;
    token?: string;
  };
}

const AlbumCard: React.FC<props> = ({
  albumSongs,
  image,
  id,
  title,
  artist,
}) => {
  const getAlbumSongsQ = useQuery(
    [id],
    async () => await axios.get<jsAlbumI>(`/album/${id}`),
    { enabled: false }
  );

  const getAlbumSongs = albumSongs?.length
    ? albumSongs
    : async () => {
        const { data } = await getAlbumSongsQ.refetch();
        const songs = data?.data.songs;
        return songs?.map((i) => i.id) ?? [];
      };

  return (
    <Card
      imageUrl={image}
      overlayChildren={
        <>
          <Icon {...entityTypeIconProps} as={BiAlbum} />
          <EntityPlaybackButton
            queueItems={getAlbumSongs}
            size="3rem"
            sourceId={id}
          />
        </>
      }
      title={title}
    >
      <Link href={`/view/album/${id}`}>
        <a>
          <Text noOfLines={2} fontWeight={700}>
            {title}
          </Text>
        </a>
      </Link>
      <Link href={`/view/artist/${artist?.id}?token=${artist?.token ?? ""}`}>
        <a>
          <Text noOfLines={1} fontSize="sm">
            {artist?.title}
          </Text>
        </a>
      </Link>
    </Card>
  );
};

export default AlbumCard;
