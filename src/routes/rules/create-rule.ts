import fp from "fastify-plugin";
import { InputJsonValue } from "@prisma/client/runtime/library";
import { createRule } from "../../services/interrogation/rulesService";

interface Params {
  id: string;
}

export default fp(async (server) => {
  server.post("/rules", async (request, reply) => {
    const body = request.body as {
      name: string;
      type: string;
      description: string;
      userId: string;
      patientRules: InputJsonValue;
      interrogationRules: InputJsonValue;
      rules: InputJsonValue;
    };
    const { userId } = body;
    try {
      const rule = await createRule(body, userId);
      return reply.send(rule);
    } catch (error) {
      server.log.error(error);
      return reply
        .code(500)
        .send({ error: "An error occurred while creating the rule" + error });
    }
  });
});
