import "../styles/globals.css";
import "@fontsource/overpass";
import type { AppProps } from "next/app";
import { ChakraProvider, Container, extendTheme } from "@chakra-ui/react";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import axios from "axios";
import { isProd } from "../constants";
import SearchBar from "../components/SearchBar";

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
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <title>Dopa</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Container size="md">
          <SearchBar />
          <Component {...pageProps} />
        </Container>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
