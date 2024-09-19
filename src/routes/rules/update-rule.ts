import fp from "fastify-plugin";
import { InputJsonValue } from "@prisma/client/runtime/library";
import {
  createRule,
  updateRule,
} from "../../services/interrogation/rulesService";

interface Params {
  id: string;
  userId: string;
}

export default fp(async (server) => {
  server.put<{ Params: Params }>(
    "/rules/:userId/:id",
    async (request, reply) => {
      const body = request.body as {
        name: string;
        type: string;
        active: boolean;
        description: string;
        userId: string;
        patientRules: InputJsonValue;
        interrogationRules: InputJsonValue;
        rules: InputJsonValue;
      };
      try {
        const rule = await updateRule(
          body,
          request.params.id,
          request.params.userId
        );
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
