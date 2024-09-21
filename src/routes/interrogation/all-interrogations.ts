import fp from "fastify-plugin";
import fastify, { FastifyPluginCallback } from "fastify";
import { PrismaClient } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

interface Params {
  id: string;
}

export default fp(async (server) => {
  const prisma = new PrismaClient();

  server.get<{ Params: Params }>(
    "/interrogation/all",
    async (request, reply) => {
      try {
        const { id } = request.params;
        const interrogations = await prisma.interrogation.findMany();
        return reply.send(interrogations);
      } catch (error) {
        server.log.error(error);
        return reply.code(500).send({
          error: "An error occurred while fetching the interrogations" + error,
        });
      }
    }
  );
});
