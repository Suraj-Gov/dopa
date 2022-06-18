import { IconButton, IconButtonProps, useToast } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { BiLogInCircle, BiLogOutCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import { supabase } from "../pages/_app";
import { userActions } from "../slices/userSlice";
import { storeStateT } from "../store";
import { googleIdentityData } from "../types";

const USER_NOT_LOGGEDIN = "USER_NOT_LOGGEDIN";

const login = async () => {
  const user = await supabase.auth.user();
  if (!user) throw new Error(USER_NOT_LOGGEDIN);
  return user;
};

const AuthButton = (props: IconButtonProps) => {
  const userState = useSelector((state: storeStateT) => state.user);
  const dispatch = useDispatch();

  const toast = useToast();

  useEffect(() => {
    login()
      .then((u) => {
        dispatch(userActions.onLogin(u));
        const idArr = u.identities!;
        const googleIdentityData = idArr[0].identity_data as googleIdentityData;
        toast({
          title: `Hey, ${googleIdentityData.full_name}`,
        });
      })
      .catch((err) => {
        if (err?.message === USER_NOT_LOGGEDIN) {
          dispatch(userActions.onLogout());
        } else {
          toast({
            status: "error",
            title: "Couldn't login",
            description: err?.message ?? "Something went wrong",
          });
        }
      });
  }, [dispatch, toast]);

  const isSignedIn = Boolean(userState.user);

  if (isSignedIn) {
    return (
      <IconButton
        {...props}
        aria-label="Log out"
        icon={<BiLogOutCircle />}
        onClick={() => dispatch(userActions.onLogout())}
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

export default AuthButton;
