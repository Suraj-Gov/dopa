import axios from "axios";
import {
  ContextConfigDefault,
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { logger } from "../utils/logger";
import {
  jsAnyI,
  jsEntityType,
  jsSearchResultsI,
  jsSongI,
} from "../../../types/jioSaavn";
import { jioSaavnEndpoint } from "../constants/api";
import { decryptSongUrl } from "../utils";

const handlers = {
  entityById: async (
    req: FastifyRequest<{
      Params: { entityType: jsEntityType; id: string };
      Querystring?: { token: string };
    }>,
    reply: FastifyReply
  ) => {
    const { entityType, id } = req.params;

    let url = "";
    switch (entityType) {
      case "song":
        url = jioSaavnEndpoint.songById(id);
        const { data: songData } = await axios.get(url);
        const song: jsSongI = songData[id];
        song.encrypted_media_url = decryptSongUrl(song.encrypted_media_url);
        return song;
      case "album":
        url = jioSaavnEndpoint.albumById(id);
        break;
      case "playlist":
        url = jioSaavnEndpoint.playlistById(id);
        break;
      case "artist":
        if (req.query?.token) {
          const { token } = req.query;
          url = jioSaavnEndpoint.artistByToken(token);
          break;
        }
        const searchUrl = jioSaavnEndpoint.search(
          decodeURIComponent(id + " artist")
        );
        const { data } = await axios.get<jsSearchResultsI>(searchUrl);
        let token = "";
        if (data?.topquery?.data[0]?.type === "artist") {
          const tokenUrl =
            data?.topquery?.data[0]?.perma_url ?? data?.topquery?.data[0]?.url;
          token = tokenUrl?.split("/").pop() ?? "";
        } else if (data?.artists?.data[0]) {
          const tokenUrl =
            data?.artists?.data[0]?.perma_url ?? data?.artists?.data[0]?.url;
          token = tokenUrl?.split("/").pop() ?? "";
        }
        if (token) {
          url = jioSaavnEndpoint.artistByToken(token);
          logger.info(url);
        } else {
          return reply.status(404).send({
            message: "No artists found",
          });
        }
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
