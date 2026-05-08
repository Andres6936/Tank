import { createAuthClient } from "better-auth/client";
import { apiKeyClient } from "@better-auth/api-key/client";
import { auth } from "./src/lib/auth";

const authClient = createAuthClient({
  baseURL: process.env.BETTER_AUTH_URL,
});

// const { data, error } = await authClient.signUp.email(
//   {
//     email: "adan-1@grr.la", // user email address
//     password: "SuperRoot", // user password -> min 8 characters by default
//     name: "Adan1", // user display name
//     callbackURL: "/dashboard", // A URL to redirect to after the user verifies their email (optional)
//   },
//   {
//     onRequest: (ctx) => {
//       //show loading
//     },
//     onSuccess: (ctx) => {
//       //redirect to the dashboard or sign in page
//     },
//     onError: (ctx) => {
//       // display the error message
//       alert(ctx.error.message);
//     },
//   },
// );

// if (error) {
//   console.error(error);
// } else {
//   console.log(data);
// }

// const data = await auth.api.createApiKey({
//   body: {
//     configId: "default",
//     name: "project-api-key",
//     expiresIn: 60 * 60 * 24 * 7,
//     userId: "VcqJqA0WmuITL9aUwdYaoALWxAW4DUVZ", // server-only
//     prefix: "sfx_",
//     remaining: 100, // server-only
//     refillAmount: 100, // server-only
//     refillInterval: 1000, // server-only
//     rateLimitTimeWindow: 1000, // server-only
//     rateLimitMax: 100, // server-only
//     rateLimitEnabled: true, // server-only
//     permissions: { files: ["read"] }, // server-only
//   },
// });

// console.log(data);

// const data = await auth.api.verifyApiKey({
//   body: {
//     configId: "default",
//     key: "sfx_OnyWdFJJhPHJNJcUzTBedglhpvvcRTBrivzPoJiySIzuJSETyOovInDdKMOMOzJI", // required
//     permissions: {
//       files: ["read"],
//     },
//   },
// });

// console.log(data);

authClient.deleteUser();
