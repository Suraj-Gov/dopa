import { jsAnyI } from "../../types/jioSaavn";
import { jioSaavnTypes } from "../types/jioSaavn";

export const resolveUrl = (entity: jioSaavnTypes.jsAnyI) => {
  switch (entity.type) {
    case "artist":
    // FIXME not used
    // artists cannot be fetched by id, instead should use tokens
    // token will always be the last part in a query > https://www.jiosaavn.com/artist/jubin-nautiyal-/uGdfg6zGf4s_
    // const token = entity.perma_url.split("/").pop();
    // return `/view/artist/${token}`;

    default:
      return `/view/${entity.type}/${entity.id}`;
  }
};

export const toNameCase = (str?: string) => {
  if (!str) return "";
  return str[0].toUpperCase() + str.substring(1);
};

export const formatSeconds = (duration: number) => {
  if (isNaN(duration)) {
    duration = 0;
  }
  const minutes = Math.floor(duration / 60);
  const seconds = (duration % 60).toFixed(0).padStart(2, "0");
  return `${minutes}:${seconds}`;
};

// https://stackoverflow.com/questions/25421233/javascript-removing-undefined-fields-from-an-object
export const removeUndefined = (obj: any) => {
  let newObj: any = {};
  Object.keys(obj).forEach((key) => {
    if (obj[key] === Object(obj[key])) newObj[key] = removeUndefined(obj[key]);
    else if (obj[key] !== undefined) newObj[key] = obj[key];
  });
  return newObj;
};
