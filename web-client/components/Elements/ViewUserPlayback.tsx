import { Box, Flex, Image, Spinner, Text, useToast } from "@chakra-ui/react";
import { User } from "firebase/auth";
import {
  arrayUnion,
  doc,
  getFirestore,
  runTransaction,
  setDoc,
} from "firebase/firestore";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import usePlaybackDetails from "../../hooks/usePlaybackDetails";
import { userActions } from "../../slices/userSlice";
import { storeStateT } from "../../store";
import { Users } from "../../types";
import { firebaseApp } from "../../utils/firebaseClient";

const db = getFirestore(firebaseApp);

interface props {
  playbackId: string;
  rUserData: User;
}

const ViewUserPlayback: React.FC<props> = ({ playbackId, rUserData }) => {
  const userState = useSelector((state: storeStateT) => state.user);
  const dispatch = useDispatch();
  const playbackDetails = usePlaybackDetails(playbackId, [rUserData?.uid]);

  const toast = useToast();

  if (!rUserData) {
    console.error("rUserData is nullish");
    return null;
  }

  if (!userState.user?.uid) {
    // if you're not logged in yet (this shouldn't even happen)
    return null;
  }

  if (playbackDetails.isLoading) {
    return <Spinner size="xs" />;
  }

  const listenToUser = async () => {
    if (userState.user) {
      if (userState.user.uid === rUserData.uid) {
        return;
      }
      dispatch(userActions.setRUser(rUserData));
      const currentUserRef = doc(db, "users", userState.user.uid);
      const rUserRef = doc(db, "users", rUserData.uid);
      try {
        await runTransaction(db, async (t) => {
          t.set(
            currentUserRef,
            { listen_to: arrayUnion(rUserData.uid) },
            { merge: true }
          );
          t.set(
            rUserRef,
            { listeners: arrayUnion(rUserData.uid) },
            { merge: true }
          ),
            Promise.resolve();
        });
        toast({
          title: `Now listening with ${rUserData.displayName}`,
          status: "info",
        });
      } catch (err: any) {
        toast({
          title: `Couldn't listen with ${rUserData.displayName}`,
          status: "error",
          description: err?.message ?? "Something went wrong",
        });
      }
    }
  };

  const title = playbackDetails.data?.data.song;
  const albumArtUrl = playbackDetails.data?.data.image;

  return (
    <Flex
      onClick={listenToUser}
      cursor={"pointer"}
      role="button"
      alignItems={"center"}
    >
      <Box position={"relative"}>
        <Image
          position={"absolute"}
          right="2"
          bottom="2"
          boxSize={"5"}
          borderRadius="full"
          src={rUserData?.photoURL ?? ""}
          alt={rUserData?.displayName ?? "?"}
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
          {rUserData.uid === userState.user?.uid
            ? "You"
            : rUserData.displayName ?? "?"}
        </Text>
      </Box>
    </Flex>
  );
};

export default ViewUserPlayback;
