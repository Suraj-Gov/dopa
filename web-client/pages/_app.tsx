import "../styles/globals.css";
import "@fontsource/overpass";
import type { AppProps } from "next/app";
import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import axios from "axios";
import { isProd } from "../constants";
import SearchBar from "../components/SearchBar";
import Player from "../components/Player";
import PlaybackContext, {
  playbackContextStateI,
} from "../context/playbackContext";

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
            <SearchBar />
            <Component {...pageProps} />
            <Player />
          </Container>
        </PlaybackContext.Provider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
