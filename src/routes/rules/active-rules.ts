import fp from "fastify-plugin";
import fastify, { FastifyPluginCallback } from "fastify";
import { PrismaClient } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { parseRange } from "../../helpers/parse-range";
import {
  getAllActiveRulesFromUserId,
  getAllActiveRulesFromUserIdWithType,
} from "../../services/interrogation/rulesService";

interface Params {
  id: string;
  type: string;
  range: string;
}

export default fp(async (server) => {
  const prisma = new PrismaClient();

  server.get<{ Params: Params }>(
    "/rules/active/:id",
    async (request, reply) => {
      try {
        const { id } = request.params;
        const rules = await getAllActiveRulesFromUserId(id);
        return reply.send(rules);
      } catch (error) {
        server.log.error(error);
        return reply.code(500).send({
          error: "An error occurred while fetching the active rules" + error,
        });
      }
    }
  );

  server.get<{ Params: Params }>(
    "/rules/active/:id/:type",
    async (request, reply) => {
      try {
        const { id, type } = request.params;
        const rules = await getAllActiveRulesFromUserIdWithType(id, type);
        return reply.send(rules);
      } catch (error) {
        server.log.error(error);
        return reply.code(500).send({
          error: "An error occurred while fetching the active rules" + error,
        });
      }
    }
  );
});
