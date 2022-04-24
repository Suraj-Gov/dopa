import "source-map-support/register";
import "dotenv/config";
import fastify from "fastify";
import cors from "fastify-cors";

import { isProd } from "./constants/env";
import { logger } from "./utils/logger";
import { escapeEncoding } from "./utils/formatter";

import searchRoutes from "./routes/search";
import trendingRoutes from "./routes/trending";
import getByIdRoutes from "./routes/getById";
import axios from "axios";

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

axios.defaults.headers.common["Cookie"] = `L=hindi%2Cenglish`;
axios.interceptors.response.use((res) => {
  if (res.status < 400) {
    res.data = escapeEncoding(res.data);
    return res;
  }
  return res;
});

server.register(getByIdRoutes, { prefix: "/api" });
server.register(searchRoutes, { prefix: "/api/search" });
server.register(trendingRoutes, { prefix: "/api/trending" });

const PORT = process.env.PORT || 4000;

server.listen(PORT, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  logger.info(`listening on ${address}`);
});
