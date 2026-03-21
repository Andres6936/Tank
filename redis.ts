import { Lux } from "@luxdb/sdk";

// Creating a custom client
const client = new Lux(
  `redis://:${process.env.REDIS_PASSWORD}@redis.andres6936.dev:6379`,
);
await client.set("counter", "0");
await client.incr("counter");
const result = await client.get("counter");
console.log(result);
await client.quit();
process.exit(0);
