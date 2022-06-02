import React from "react";
import { Image, StyleSheet, View } from "react-native";

interface props {
  albumImageUrl: string;
  width: number;
}

const Card: React.FC<props> = ({ albumImageUrl, width }) => {
  const albumImageWidth = width;
  const albumImageDimensions = {
    width: albumImageWidth,
    height: albumImageWidth,
  };
  return (
    <Image
      style={{
        ...styles.albumImage,
        ...albumImageDimensions,
      }}
      source={{ uri: albumImageUrl }}
    />
  );
};

export default Card;

const styles = StyleSheet.create({
  albumImage: {
    borderRadius: 6,
  },
});
