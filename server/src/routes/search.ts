import axios from "axios";
import { ContextConfigDefault, FastifyInstance, FastifyRequest } from "fastify";
import { escapeEncoding } from "../utils/formatter";

import { jioSaavnEndpoint } from "../constants/api";

const handlers = {
  any: async (req: FastifyRequest<{ Querystring: { search: string } }>) => {
    const { search } = req.query;
    const url = jioSaavnEndpoint.search(search);
    const { data } = await axios.get(url);
    return escapeEncoding(data);
  },
};

const routes = (
  fastify: FastifyInstance,
  _config: ContextConfigDefault,
  done: Function
) => {
  fastify.get("/any", handlers.any);
  done();
};

export default routes;
