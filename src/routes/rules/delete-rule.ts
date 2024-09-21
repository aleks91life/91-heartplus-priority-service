import fp from "fastify-plugin";
import { InputJsonValue } from "@prisma/client/runtime/library";
import {
  createRule,
  deleteRule,
  updateRule,
} from "../../services/interrogation/rulesService";

interface Params {
  id: string;
  userId: string;
}

export default fp(async (server) => {
  server.delete<{ Params: Params }>(
    "/rules/:userId/:id",
    async (request, reply) => {
      try {
        const rule = await deleteRule(request.params.id, request.params.userId);
        return reply.send(rule);
      } catch (error) {
        server.log.error(error);
        return reply
          .code(500)
          .send({ error: "An error occurred while creating the rule" + error });
      }
    }
  );
});
