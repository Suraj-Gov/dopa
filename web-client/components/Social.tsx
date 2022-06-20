import {
  Box,
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  IconButton,
  IconButtonProps,
  Image,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { BsHeadphones } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../slices/userSlice";
import { storeStateT } from "../store";
import { googleIdentityData, Users } from "../types";
import {
  getAuth,
  signInWithRedirect,
  GoogleAuthProvider,
  User,
} from "firebase/auth";
import {
  collection,
  addDoc,
  documentId,
  getFirestore,
  setDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import { firebaseApp } from "../utils/firebaseClient";
import { BiLogIn } from "react-icons/bi";
import useToast from "../hooks/useToast";
import { removeUndefined, toJSDate } from "../helpers";
import ViewUserPlayback from "./Elements/ViewUserPlayback";

const REFRESH_INTERVAL = 20_000;

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile	");

const Social = (props: IconButtonProps) => {
  const userState = useSelector((state: storeStateT) => state.user);
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Users[]>([]);

  const toast = useToast();

  const login = async () => {
    const { currentUser } = auth;
    if (!currentUser) {
      signInWithRedirect(auth, provider);
    }
  };

  // TODO
  const logout = async () => {
    auth.signOut();
    userActions.onLogout();
  };

  useEffect(
    function onLogin() {
      setTimeout(async () => {
        const { currentUser } = auth;
        const userData = removeUndefined(currentUser?.toJSON()) as User;
        setIsLoggedIn(Boolean(userData));
        if (!currentUser) {
          return;
        }
        try {
          await setDoc(
            doc(db, "users", currentUser.uid),
            { userData },
            {
              merge: true,
            }
          );
        } catch (error: any) {
          toast.error({
            title: "Couldn't save user",
            description: error?.message,
          });
          return;
        }
        dispatch(userActions.onLogin(userData));
        const name = currentUser.displayName;
        toast.success({
          title: `Hey, ${name}`,
        });
      }, 1000);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [dispatch]
  );

  useEffect(
    function subToOnlineUsers() {
      if (!userState.user) {
        return;
      }
      const tz = new Date(Date.now() - REFRESH_INTERVAL);
      const activePlayersQ = query(
        collection(db, "users"),
        where("last_seen", ">", tz)
      );
      const fetchPlayers = async () => {
        // do not populate if not empty
        if (onlineUsers.length) {
          return;
        }
        try {
          const players = await getDocs(activePlayersQ);
          const playersArr = players.docs.map(
            (d) =>
              ({
                ...d.data(),
                id: d.id,
                last_seen: toJSDate(d.data().last_seen),
              } as Users)
          );
          setOnlineUsers(playersArr as Users[]);
        } catch (err) {
          console.error(`couldn't fetch players`);
        }
      };
      fetchPlayers();
      const unSubActivePlayers = onSnapshot(activePlayersQ, (snapshot) => {
        const changes = snapshot.docChanges();
        changes.forEach((c) => {
          const uid = c.doc.id;
          const playerData = {
            ...c.doc.data(),
            id: uid,
            last_seen: toJSDate(c.doc.data().last_seen),
          } as Users;
          setOnlineUsers((x) => {
            const newUsers = [...x, playerData];

            // deduplicate with a map and return its values
            const usersMap = newUsers.reduce((finObj, curr) => {
              finObj ??= {};
              finObj[curr.id] = curr;
              return finObj;
            }, {} as { [k: string]: any });

            return Object.values(usersMap);
          });
        });
      });

      return () => {
        unSubActivePlayers();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [userState]
  );

  useEffect(function removeStaleUsers() {
    setInterval(() => {
      setOnlineUsers((users) => {
        return users.filter(
          (u) => (u.last_seen?.getTime() ?? 0) > Date.now() - REFRESH_INTERVAL
        );
      });
    }, REFRESH_INTERVAL);
  });

  const drawerDisc = useDisclosure();

  const renderOnlineUsers = useMemo(() => {
    return (
      <Box>
        <Text fontSize={"xl"} fontWeight={"bold"}>
          Online
        </Text>
        <Box>
          {onlineUsers.map((i) => (
            <Flex my="4" key={i.id}>
              <ViewUserPlayback
                rUserData={i.userData}
                playbackId={i.playback_id ?? ""}
              />
            </Flex>
          ))}
        </Box>
      </Box>
    );
  }, [onlineUsers]);

  if (isLoggedIn) {
    return (
      <>
        <IconButton
          {...props}
          aria-label="View online users"
          isDisabled={!onlineUsers.length}
          icon={<BsHeadphones />}
          onClick={drawerDisc.onOpen}
        />
        <Drawer
          placement="top"
          isOpen={drawerDisc.isOpen}
          onClose={drawerDisc.onClose}
        >
          <DrawerContent borderRadius="6">
            <DrawerCloseButton zIndex={"50"} mt="2" mr="2" />
            <DrawerBody>
              <Container mt="4" position="relative" size="md">
                {renderOnlineUsers}
              </Container>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </>
    );
  }

  return (
    <IconButton
      {...props}
      aria-label="Log in"
      icon={<BiLogIn />}
      onClick={login}
    />
  );
};

export default Social;
