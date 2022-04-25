import CryptoJS from "crypto-js";
// the key
const key = "38346591";

//
export const decryptSongUrl = (ciphertext: string) => {
  const keyHex = CryptoJS.enc.Utf8.parse(key);
  const decrypted = CryptoJS.DES.decrypt(
    // @ts-ignore
    {
      ciphertext: CryptoJS.enc.Base64.parse(ciphertext),
    },
    keyHex,
    {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7,
    }
  );
  return decrypted.toString(CryptoJS.enc.Utf8).replace("_96", "_320");
};
