import { createClient } from "@supabase/supabase-js";
import {
  Box,
  ChakraProvider,
  Container,
  extendTheme,
  useToast,
} from "@chakra-ui/react";
import "@fontsource/overpass";
import axios from "axios";
import type { AppProps } from "next/app";
import Head from "next/head";
import { QueryClient, QueryClientProvider } from "react-query";
import Player from "../components/Player";
import Search from "../components/Search";
import { isProd } from "../constants";
import { Provider } from "react-redux";
import "../styles/globals.css";
import { store } from "../store";
import { useEffect } from "react";

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
    heading: "Overpass",
    body: "Overpass",
  },
});

// TODO change after deployment
axios.defaults.baseURL = isProd ? "" : "http://localhost:4000/api";

function MyApp({ Component, pageProps }: AppProps) {
  const toast = useToast();

  useEffect(() => {
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
      </Head>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}>
          <Container position={"relative"} maxW="2xl">
            <Search />
            <Component {...pageProps} />
            <Player />
          </Container>
        </Provider>
      </QueryClientProvider>
    </ChakraProvider>
  );
}

export default MyApp;
