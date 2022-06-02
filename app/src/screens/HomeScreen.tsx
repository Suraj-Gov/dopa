import { SearchBar, Skeleton, Text } from "@rneui/base";
import axios from "axios";
import React, { useState } from "react";
import {
  Appearance,
  FlatList,
  ListRenderItem,
  Platform,
  StyleSheet,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import Card from "../components/Card";
import CardSkeletonRow from "../components/loaders/FourCardLoader";
import { jioSaavnTypes } from "../types";
import { jsTrendingI } from "../types/jioSaavnTypes";

interface props {}

const HomeScreen: React.FC<props> = () => {
  const [listWidth, setListWidth] = useState(0);

  const getTrending = useQuery(
    ["trending"],
    async () => await axios.get<jsTrendingI>("/trending/all")
  );

  type trendingItemsT = jsTrendingI["new_trending"][0];
  const renderItem: ListRenderItem<trendingItemsT> = ({ index, item }) => (
    <Card width={listWidth / 2} albumImageUrl={item.image} />
  );

  return (
    <View style={styles.container}>
      <Text h1>Trending</Text>
      <View style={styles.container}>
        {getTrending.isLoading && (
          <CardSkeletonRow
            containerWidth={listWidth}
            skeletonsInRowCount={2}
            spacing={10}
          />
        )}
        {getTrending.isSuccess && (
          <FlatList
            keyExtractor={(i) => i.id}
            onLayout={({ nativeEvent }) => {
              setListWidth(nativeEvent.layout.width);
            }}
            renderItem={renderItem}
            numColumns={2}
            data={getTrending.data.data.charts}
          ></FlatList>
        )}
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "red",
    flex: 1,
    margin: 16,
  },
});
