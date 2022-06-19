import {
  Container,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  IconButton,
  IconButtonProps,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { BsHeadphones } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { userActions } from "../slices/userSlice";
import { storeStateT } from "../store";
import { googleIdentityData, Player } from "../types";
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
} from "firebase/firestore";
import { firebaseApp } from "../utils/firebaseClient";
import { BiLogIn } from "react-icons/bi";
import useToast from "../hooks/useToast";
import { removeUndefined } from "../helpers";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);
const provider = new GoogleAuthProvider();
provider.addScope("https://www.googleapis.com/auth/userinfo.profile	");

const Profile = (props: IconButtonProps) => {
  const userState = useSelector((state: storeStateT) => state.user);
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Player[]>([]);

  const toast = useToast();

  const login = async () => {
    const { currentUser } = auth;
    if (!currentUser) {
      signInWithRedirect(auth, provider);
    }
  };

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

  useEffect(() => {
    if (!userState.user) {
      return;
    }
    const tz = new Date(Date.now() - 30_000);
    const activePlayersQ = query(
      collection(db, "users"),
      where("last_seen", ">", tz)
    );
    const fetchPlayers = async () => {
      try {
        const players = await getDocs(activePlayersQ);
        const playersArr = players.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOnlineUsers(playersArr as Player[]);
      } catch (err) {
        console.error(`couldn't fetch players`);
      }
    };
    fetchPlayers();
    const unSubActivePlayers = onSnapshot(activePlayersQ, (snapshot) => {
      const changes = snapshot.docChanges();
      changes.forEach((c) => {
        const uid = c.doc.id;
        const playerData = { ...c.doc.data(), id: uid } as Player;
        switch (c.type) {
          case "added": {
            setOnlineUsers((x) => [...x, { ...playerData, id: uid }]);
            break;
          }
          case "modified": {
            setOnlineUsers((x) => {
              return [...x].map((i) => (i.id === uid ? playerData : i));
            });
            break;
          }
          case "removed": {
            setOnlineUsers((x) => {
              return [...x].filter((i) => i.id !== uid);
            });
            break;
          }
        }
      });
    });

    return () => {
      unSubActivePlayers();
    };
  }, [userState]);

  const drawerDisc = useDisclosure();

  if (isLoggedIn) {
    return (
      <>
        <IconButton
          {...props}
          aria-label="Log out"
          icon={<BsHeadphones />}
          onClick={drawerDisc.onOpen}
        />
        <Drawer
          placement="top"
          isOpen={drawerDisc.isOpen}
          onClose={drawerDisc.onClose}
        >
          <DrawerContent borderRadius="6">
            <DrawerCloseButton mt="2" mr="2" />
            <DrawerBody>
              <DrawerHeader>Listen Along</DrawerHeader>
              <Container position="relative" size="md">
                {JSON.stringify(onlineUsers, null, 2)}
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

export default Profile;
