import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import axios from "axios";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { QueryClient, QueryClientProvider } from "react-query";
import { baseUrl } from "./src/constants/api";
import HomeScreen from "./src/screens/HomeScreen";

const Stack = createNativeStackNavigator();

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

// TODO change after deployment
axios.defaults.baseURL = baseUrl + "/api";

export default function App() {
  // TODO redux playback

  return (
    <NavigationContainer>
      <QueryClientProvider client={queryClient}>
        {/* https://stackoverflow.com/questions/71791347/npm-package-cannot-be-used-as-a-jsx-component-type-errors */}
        <Stack.Navigator>
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </QueryClientProvider>
    </NavigationContainer>
  );
}
