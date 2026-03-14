// import { generateKeyPairSync } from "crypto";
// const { publicKey, privateKey } = generateKeyPairSync("ed25519");

// // Export private key in PKCS#8 PEM format
// const privPem = privateKey.export({ format: "pem", type: "pkcs8" });
// await Bun.write("private.pem", privPem);

// // Export public key in SPKI PEM format
// const pubPem = publicKey.export({ format: "pem", type: "spki" });
// await Bun.write("public.pem", pubPem);

import { importPKCS8, SignJWT } from "jose";
import { createClient } from "@libsql/client";
import { add } from "date-fns";

const file = Bun.file("private/private.pem");
const privateKey = await importPKCS8(await file.text(), "EdDSA");
const expirationTime = add(new Date(), { months: 3 });

const payload = {
  sub: "Andres6936",
  name: "Joan Buriticá",
  iat: Math.floor(Date.now() / 1000), // Issued At
  exp: Math.floor(expirationTime.getTime() / 1000), // Expiration time
};
const jwt = await new SignJWT(payload)
  .setProtectedHeader({ alg: "EdDSA" })
  .sign(privateKey); // Pass the private key object

await Bun.write("private/token.txt", jwt);

// const client = createClient({
//   // Conectamos a la IP directa para que Bun/Windows no busquen en el DNS
//   url: "https://turso.andres6936.dev/",
//   authToken: jwt,
// });

// await client.batch(
//   [
//     "CREATE TABLE IF NOT EXISTS users (email TEXT)",
//     "INSERT INTO users VALUES ('XXX@example.com')",
//     "INSERT INTO users VALUES ('YYYd@example.com')",
//     "INSERT INTO users VALUES ('QQQ@example.com')",
//   ],
//   "write",
// );

// const result = await client.execute("SELECT * FROM users");

// console.log("Users:", result.rows);
