import fp from "fastify-plugin";
import {
  FilterRow,
  InterrogationRequest,
  InterrogationRequestType,
  Rule,
} from "../../types";

import { debug, logger } from "../../utils";
import { FastifyPluginCallback } from "fastify";
import { calculatePriority } from "../../services/interrogation/calculatePriorityService";

export default fp(async (server) => {
  return server.route<{ Body: InterrogationRequestType[] }>({
    url: "/interrogation/calculate-priority",
    logLevel: "warn",
    method: ["POST"],
    schema: {
      body: {
        type: "array",
        items: InterrogationRequest,
      },
    },
    async handler(request, reply) {
      const body = request.body as InterrogationRequestType[];

      try {
        let results = await calculatePriority(body);

        return reply.send({
          results,
        });
      } catch (e: any) {
        logger.error("Error calculating priority for interrogation ID ", e);
        return reply.status(500).send("Internal Server Error");
      }
    },
  });
}) as FastifyPluginCallback;
