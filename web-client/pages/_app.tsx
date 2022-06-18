import { createClient } from "@supabase/supabase-js";
import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  Spacer,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import "@fontsource/roboto-flex";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import Player from "../components/Player";
import Search from "../components/Search";
import { isProd } from "../constants";
import { Provider as ReduxProvider } from "react-redux";
import "../styles/globals.css";
import { store } from "../store";
import { useEffect, useRef, useState } from "react";
import RTCContext, { serverConfig } from "../components/Context/RTCContext";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const theme = extendTheme({
  fonts: {
    heading: `'Roboto Flex', sans-serif`,
    body: `'Roboto Flex', sans-serif`,
  },
});

// TODO change after deployment
axios.defaults.baseURL = isProd
  ? ""
  : "https://evidence-arctic-magazine-pages.trycloudflare.com/api";

function MyApp({ Component, pageProps }: AppProps) {
  const toast = useToast();
  const [pConn, setPConn] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    setPConn(new RTCPeerConnection(serverConfig));
    axios.interceptors.response.use((res) => {
      if (res.status >= 400) {
        toast({
          status: "error",
          title: "Something went wrong",
          description: `${res.status} - ${res.statusText}`,
        });
      }
      return res;
    });
  }, [toast]);

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Dopa</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
      </Head>
      <QueryClientProvider client={queryClient}>
        <ReduxProvider store={store}>
          <RTCContext.Provider
            value={{
              pConn: pConn,
              localStream: null as null | MediaStreamTrack,
              remoteStream: null as null | MediaStreamTrack,
            }}
          >
            <Container position={"relative"} maxW="2xl">
              <Search />
              <Spacer h="2rem" />
              <Component {...pageProps} />
              <Player />
              <Spacer h="8rem" />
            </Container>
          </RTCContext.Provider>
        </ReduxProvider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
