/**
 * Warning!! Changing these functions might result in losing encrypted data!!
 */
import crypto from "crypto";

const encryptionKey = process.env.ENCRYPTION_KEY;
const encryptionInitVector = process.env.ENCRYPTION_INITIALIZATION_VECTOR;
const algorithm = process.env.ENCRYPTION_ALGORITHM;

export function encryptString(string: string): string {
     if (!encryptionKey || !encryptionInitVector || !algorithm) {
          throw new Error("encryptionKey, encryptionInitVector, and algorithm are required");
     }

     const key = crypto.createHash("sha512").update(encryptionKey).digest("hex").substring(0, 32);
     const encryptionIV = crypto.createHash("sha512").update(encryptionInitVector).digest("hex").substring(0, 16);

     const cipher = crypto.createCipheriv(algorithm, key, encryptionIV);
     return Buffer.from(cipher.update(string, "utf8", "hex") + cipher.final("hex")).toString("base64");
}

export function decryptString(string: string): string {
     if (!encryptionKey || !encryptionInitVector || !algorithm) {
          throw new Error("encryptionKey, encryptionInitVector, and algorithm are required");
     }

     const key = crypto.createHash("sha512").update(encryptionKey).digest("hex").substring(0, 32);
     const encryptionIV = crypto.createHash("sha512").update(encryptionInitVector).digest("hex").substring(0, 16);

     const buff = Buffer.from(string, "base64");
     const decipher = crypto.createDecipheriv(algorithm, key, encryptionIV);
     return decipher.update(buff.toString("utf8"), "hex", "utf8") + decipher.final("utf8");
}
