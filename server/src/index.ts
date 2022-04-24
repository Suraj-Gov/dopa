import "source-map-support/register";
import "dotenv/config";
import fastify from "fastify";
import cors from "fastify-cors";

import { isProd } from "./constants/env";
import { logger } from "./utils/logger";

import searchRoutes from "./routes/search";
import trendingRoute from "./routes/trending";

const server = fastify({
  logger: {
    prettyPrint: isProd
      ? false
      : {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
  },
});

server.register(cors);

server.get("/ping", async (_request, _reply) => {
  return "pong";
});

server.register(searchRoutes, { prefix: "/api/search" });
server.register(trendingRoute, { prefix: "/api/trending" });

const PORT = process.env.PORT || 4000;

server.listen(PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  logger.info(`listening on ${address}`);
});
