import { chakra } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

export interface ArtistsLinksProps {
  artists?: {
    name?: string;
    id?: string;
    perma_url?: string;
  }[];
}

const ArtistsLinks: React.FC<ArtistsLinksProps> = ({ artists }) => {
  return (
    <>
      {artists?.map((a, idx) => (
        <span key={a.id}>
          <Link
            key={a.id}
            href={`/view/artist/${a.id}?token=${
              a.perma_url?.split("/").pop() ?? ""
            }`}
          >
            <a>{a.name}</a>
          </Link>
          {idx + 1 !== artists.length && (
            <chakra.span mx="1">&bull;</chakra.span>
          )}
        </span>
      ))}
    </>
  );
};

export default ArtistsLinks;
