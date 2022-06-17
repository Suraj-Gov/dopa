import { IconProps } from "@chakra-ui/react";

export const isProd = process.env.NODE_ENV === "production";

export const entityTypeIconProps: IconProps = {
  position: "absolute",
  m: "3",
  boxSize: "5",
  color: "white",
};
