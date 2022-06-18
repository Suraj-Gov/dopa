import { IconButton, IconButtonProps, useToast } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../pages/_app";
import { userActions } from "../slices/userSlice";
import { storeStateT } from "../store";
import { googleIdentityData } from "../types";

const Profile = (props: IconButtonProps) => {
  const userState = useSelector((state: storeStateT) => state.user);
  const dispatch = useDispatch();

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const toast = useToast();

  const login = async () => {
    if (!userState.user) {
      const res = await supabase.auth.signIn({ provider: "google" });
      if (res.user) {
        userActions.onLogin(res.user);
        setIsLoggedIn(true);
      }
    }
  };

  const logout = async () => {
    userActions.onLogout();
    await supabase.auth.signOut();
  };

  useEffect(() => {
    setTimeout(() => {
      const user = supabase.auth.user();
      setIsLoggedIn(Boolean(user));
      if (!user) {
        return;
      }
      dispatch(userActions.onLogin(user));
      const idArr = user.identities!;
      const googleIdentityData = idArr[0].identity_data as googleIdentityData;
      toast({
        title: `Hey, ${googleIdentityData.full_name}`,
      });
    }, 2000);
  }, [dispatch, toast]);

  if (isLoggedIn) {
    return (
      <IconButton
        {...props}
        aria-label="Log out"
        icon={<BiLogOutCircle />}
        onClick={logout}
      />
    );
  }

  return (
    <IconButton
      {...props}
      aria-label="Log in"
      icon={<BiLogInCircle />}
      onClick={login}
    />
  );
};

export default Profile;
