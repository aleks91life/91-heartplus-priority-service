import fp from "fastify-plugin";
import fastify, { FastifyPluginCallback } from "fastify";
import { PrismaClient } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { parseRange } from "../../helpers/parse-range";
import { RangeParams } from "../../types";

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

        // const data2 = parseRange(range) as RangeParams;
        // const page = data2.page;
        // const perPage = data2.perPage;

        const rules = await prisma.rules.findMany({
          where: {
            active: true,
            // hospitalId: id,
          },
          //   take: perPage,
          //   skip: (page - 1) * perPage,
        });
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
        const rules = await prisma.rules.findMany({
          where: {
            active: true,
            hospitalId: id,
            type: type,
          },
        });
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
