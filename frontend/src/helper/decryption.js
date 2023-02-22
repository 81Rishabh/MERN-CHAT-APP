import CryptoJS  from "crypto-js";

export default function decrypt(ciphertext , key) {
    var bytes  = CryptoJS.AES.decrypt(ciphertext, key);
    var originalText = bytes.toString(CryptoJS.enc.Utf8);
    return originalText;
}