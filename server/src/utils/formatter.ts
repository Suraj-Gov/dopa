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

export const resizeImages = (x: any) => {
  try {
    const plaintextObj = JSON.stringify(x);
    const resized = plaintextObj.replace(/50x50|100x100|150x150/g, "250x250");
    return JSON.parse(resized);
  } catch (err) {
    return x;
  }
};
