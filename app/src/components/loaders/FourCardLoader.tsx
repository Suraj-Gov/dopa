import { Skeleton } from "@rneui/base";
import React from "react";
import { View } from "react-native";

const CardSkeleton = (props: { sideLength: number; margins: number }) => {
  const { margins, sideLength } = props;
  return (
    <Skeleton
      style={{ margin: margins }}
      width={sideLength}
      height={sideLength}
    />
  );
};

interface props {
  spacing: number;
  containerWidth: number;
  skeletonsInRowCount: number;
}

const CardSkeletonRow: React.FC<props> = ({
  containerWidth,
  skeletonsInRowCount,
  spacing,
}) => {
  const sideLength = containerWidth / skeletonsInRowCount;
  return (
    <View>
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        {Array.from(Array(skeletonsInRowCount)).map((_) => (
          <CardSkeleton margins={spacing} sideLength={sideLength} />
        ))}
      </View>
    </View>
  );
};

export default CardSkeletonRow;
