import "../styles/globals.css";
import "@fontsource/overpass";
import type { AppProps } from "next/app";
import { MantineProvider } from "@mantine/core";
import { theme } from "../constants/theme";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect } from "react";
import axios from "axios";
import { isProd } from "../constants";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// TODO change after deployment
axios.defaults.baseURL = isProd ? "" : "http://localhost:4000/api";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider theme={theme}>
      <Head>
        <title>Dopa</title>
      </Head>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </MantineProvider>
  );
}

export default MyApp;
