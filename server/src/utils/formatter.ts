import unescape from "lodash.unescape";

export const escapeEncoding = (x: any) => {
  try {
    switch (typeof x) {
      case "string":
        return unescape(x);
      case "object":
        for (const key in x) {
          x[key] = escapeEncoding(x[key]);
        }
        return x;
      default:
        return x;
    }
  } catch (err) {
    return x;
  }
};
