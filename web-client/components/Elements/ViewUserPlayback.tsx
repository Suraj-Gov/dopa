import { Box, Flex, Image, Spinner, Text } from "@chakra-ui/react";
import React from "react";
import usePlaybackDetails from "../../hooks/usePlaybackDetails";

interface props {
  playbackId: string;
  userDisplayName: string;
  userPhotoUrl: string;
}

const ViewUserPlayback: React.FC<props> = ({
  playbackId,
  userDisplayName,
  userPhotoUrl,
}) => {
  const playbackDetails = usePlaybackDetails(playbackId);

  if (playbackDetails.isLoading) {
    return <Spinner size="xs" />;
  }

  const title = playbackDetails.data?.data.song;
  const albumArtUrl = playbackDetails.data?.data.image;

  return (
    <Flex alignItems={"center"}>
      <Box position={"relative"}>
        <Image
          position={"absolute"}
          right="2"
          bottom="2"
          boxSize={"5"}
          borderRadius="full"
          src={userPhotoUrl}
          alt={userDisplayName}
        />
        {playbackDetails.isLoading ? (
          <Spinner size="lg" />
        ) : (
          <Image
            borderRadius={"8"}
            boxSize={"16"}
            src={albumArtUrl}
            alt={title}
          />
        )}
      </Box>
      <Box ml="4">
        <Text noOfLines={2} fontSize="lg" fontWeight="bold">
          {title}
        </Text>
        <Text noOfLines={1} fontSize="sm">
          {userDisplayName}
        </Text>
      </Box>
    </Flex>
  );
};

export default ViewUserPlayback;
