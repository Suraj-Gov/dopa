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
import { useQuery } from "react-query";
import Card from "../components/Card";
import { jioSaavnTypes } from "../types";
import { jsTrendingI } from "../types/jioSaavnTypes";

interface props {}

const HomeScreen: React.FC<props> = () => {
  const getTrending = useQuery(
    ["trending"],
    async () => await axios.get<jsTrendingI>("/trending/all")
  );

  type trendingItemsT = jsTrendingI["new_trending"][0];
  const renderItem: ListRenderItem<trendingItemsT> = ({ index, item }) => (
    <Card albumImageUrl={item.image} />
  );

  return (
    <View>
      {getTrending.isLoading && <Skeleton width={30} height={30} />}
      {getTrending.isSuccess && (
        <View style={styles.container}>
          <Text h1>Trending</Text>
          <FlatList
            renderItem={renderItem}
            numColumns={2}
            data={getTrending.data.data.new_trending}
          ></FlatList>
        </View>
      )}
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});
