import fp from "fastify-plugin";
import { InterrogationRequest, InterrogationRequestType } from "../../types";
import { debug, logger } from "../../utils";
import { FastifyPluginCallback } from "fastify";
import { PrismaClient } from "@prisma/client";
import { interpretLead } from "../../types/lead";
import { InterpretRule, LeadRule, RuleBasic } from "../../types/rule";

const prisma = new PrismaClient();

async function calculatePriority(
  data: InterrogationRequestType
): Promise<String> {
  // Get all the rules from the database
  // For each rule, check if the rule applies to the interrogation
  // If the rule applies, calculate the priority
  // Save the priority in the database
  // If the rule does not apply, continue to the next rule
  // Return true if the priority was calculated successfully
  // Return false if there was an error calculating the

  let rules = await prisma.rules.findMany({
    where: {
      active: true,
      hospitalId: "1",
      type: "lead",
    },
  });

  let response = "";

  for (let rule of rules) {
    let ruleR = rule as unknown as LeadRule;
    switch (rule.type) {
      case "lead":
        const interpretedLead = await interpretLead(ruleR, [data]);
        response += JSON.stringify(interpretedLead, null, 2);
        break;
      default:
        console.log("Skipping unused rule!");
        break;
    }
  }
  return "Priority calculated! for " + rules.length + "\n" + response;
}

export default fp(async (server, opts) => {
  return server.route<{ Body: InterrogationRequestType }>({
    url: "/interrogation",
    logLevel: "warn",
    method: ["POST"],
    schema: {
      body: InterrogationRequest,
    },
    async handler(request, reply) {
      const body = request.body;
      const device = body?.device?.manufacturer ?? "";

      try {
        const interrogation = await prisma.interrogation.create({
          data: {
            type: device,
            data: body,
          },
        });

        const calculatedPriority = await calculatePriority(body);
        console.log(calculatedPriority);

        debug("Interrogation created: ", interrogation);
      } catch (e: any) {
        logger.error("Error saving interrogation to database: ", e);
      } finally {
        await prisma.$disconnect();
      }

      try {
        return reply.send({
          message: "Interrogation received and saved to database successfully!",
        });
      } catch (e: any) {
        logger.error("Error calculating priority for interrogation ID ", e);
        return reply.status(500).send("Internal Server Error");
      }
    },
  });
}) as FastifyPluginCallback;
