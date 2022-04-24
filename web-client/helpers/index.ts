import { jsAnyI } from "../../types/jioSaavn";
import { jioSaavnTypes } from "../types/jioSaavn";

export const resolveUrl = (entity: jioSaavnTypes.jsAnyI) => {
  switch (entity.type) {
    case "artist":
      // artists cannot be fetched by id, instead should use tokens
      // token will always be the last part in a query > https://www.jiosaavn.com/artist/jubin-nautiyal-/uGdfg6zGf4s_
      const token = entity.perma_url.split("/").pop();
      return `/view/artist/${token}`;

    default:
      return `/view/${entity.type}/${entity.id}`;
  }
};

export const toNameCase = (str: string) =>
  str[0].toUpperCase() + str.substring(1);
