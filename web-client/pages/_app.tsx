import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import "@fontsource/overpass";
import axios from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "react-query";
import Player from "../components/Player";
import Search from "../components/Search";
import { isProd } from "../constants";
import PlaybackContext, {
  playbackContextStateI,
} from "../context/playbackContext";
import "../styles/globals.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

const theme = extendTheme({
  fonts: {
    heading: "Overpass",
    body: "Overpass",
  },
});

// TODO change after deployment
axios.defaults.baseURL = isProd ? "" : "http://localhost:4000/api";

function MyApp({ Component, pageProps }: AppProps) {
  const [playbackContext, setPlaybackContext] = useState<playbackContextStateI>(
    {
      isPlaying: false,
      playbackId: null,
    }
  );

  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Dopa</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <PlaybackContext.Provider
          value={{ playbackContext, setPlaybackContext }}
        >
          <Container size="md">
            <Search />
            <Component {...pageProps} />
            <Player />
          </Container>
        </PlaybackContext.Provider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
