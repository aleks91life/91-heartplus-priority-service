import fp from "fastify-plugin";
import fastify, { FastifyPluginCallback } from "fastify";
import { PrismaClient } from "@prisma/client";
import { InputJsonValue } from "@prisma/client/runtime/library";

interface Params {
  id: string;
}

export default fp(async (server) => {
  const prisma = new PrismaClient();

  server.post("/rules", async (request, reply) => {
    const body = request.body as {
      name: string;
      type: string;
      description: string;
      hospitalId: string;
      data: InputJsonValue;
    };
    const { name, type, description, hospitalId, data } = body;
    try {
      const rule = await prisma.rules.create({
        data: {
          name,
          type,
          description,
          hospitalId,
          data,
        },
      });
      return reply.send(rule);
    } catch (error) {
      server.log.error(error);
      return reply
        .code(500)
        .send({ error: "An error occurred while creating the rule" + error });
    }
  });
});
