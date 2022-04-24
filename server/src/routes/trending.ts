import axios from "axios";
import { ContextConfigDefault, FastifyInstance, FastifyRequest } from "fastify";
import { jioSaavnTypes } from "../types/jioSaavn";
import { escapeEncoding } from "../utils/formatter";

import { jioSaavnEndpoint } from "../constants/api";

const handlers = {
  all: async (_req: FastifyRequest) => {
    const url = jioSaavnEndpoint.trending;
    const { data } = await axios.get<jioSaavnTypes.jsTrendingI>(url);
    return escapeEncoding(data);
  },
};

const routes = (
  fastify: FastifyInstance,
  _config: ContextConfigDefault,
  done: Function
) => {
  fastify.get("/all", handlers.all);
  done();
};

export default routes;
