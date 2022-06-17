import React from "react";
import Card from "../BaseCard";
import { entityTypeIconProps } from "../../constants";
import { jsArtistI } from "../../../types/jioSaavn";
import { Icon, Text } from "@chakra-ui/react";
import { BsFillPersonFill } from "react-icons/bs";
import Link from "next/link";

interface props {
  imageUrl: string;
  name: string;
  url: string;
}

const ArtistCard: React.FC<props> = ({ imageUrl, name, url }) => {
  return (
    <Card
      imageUrl={imageUrl}
      overlayChildren={<Icon {...entityTypeIconProps} as={BsFillPersonFill} />}
      title={name}
      url={url}
    >
      <Link href={url}>
        <a>
          <Text noOfLines={2} fontWeight={700}>
            {name}
          </Text>
        </a>
      </Link>
    </Card>
  );
};

export default ArtistCard;
