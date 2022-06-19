import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  Spacer,
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
axios.defaults.baseURL = isProd ? "" : "http://localhost:4000/api";

function MyApp({ Component, pageProps }: AppProps) {
  const [pConn, setPConn] = useState<RTCPeerConnection | null>(null);

  useEffect(() => {
    setPConn(new RTCPeerConnection(serverConfig));
  }, []);

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
