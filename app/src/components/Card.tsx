import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface props {
  albumImageUrl: string;
}

const Card: React.FC<props> = ({ albumImageUrl }) => {
  return (
    <View>
      <Image style={styles.albumImage} source={{ uri: albumImageUrl }} />
    </View>
  );
};

export default Card;

const styles = StyleSheet.create({
  albumImage: {
    width: 50,
    height: 50,
    borderRadius: 6,
  },
});
