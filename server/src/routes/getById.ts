import axios from "axios";
import {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { jsAnyI, jsEntityType } from "../../../types/jioSaavn";
import { jioSaavnEndpoint } from "../constants/api";

const handlers = {
  entityById: async (
    req: FastifyRequest<{ Params: { entityType: jsEntityType; id: string } }>,
    reply: FastifyReply
  ) => {
    const { entityType, id } = req.params;

    let url = "";
    switch (entityType) {
      case "song":
        url = jioSaavnEndpoint.songById(id);
        break;
      case "album":
        url = jioSaavnEndpoint.albumById(id);
        break;
      case "playlist":
        url = jioSaavnEndpoint.playlistById(id);
        break;
      case "artist":
        url = jioSaavnEndpoint.artistByToken(id);
        break;
      default:
        return reply.status(404).send({
          message: "Unknown entity",
        });
    }
    const { data } = await axios.get(url);
    return {
      ...data,
      type: entityType,
    } as jsAnyI;
  },
};

const routes = (
  fastify: FastifyInstance,
  _config: ContextConfigDefault,
  done: Function
) => {
  fastify.get("/:entityType/:id", handlers.entityById);
  done();
};

export default routes;
