import fastify, { FastifyInstance } from "fastify";
import blipp from "fastify-blipp";

import env from "./env";
import { logger } from "./utils";
import { validateRequest } from "./utils/auth";
import interrogationRequestRoute from "./routes/interrogation/interrogation";
import formBody from "@fastify/formbody";
import path from "path";

const server: FastifyInstance = fastify();

console.log("[*] Currently running in " + env.NODE_ENV + " mode");
// server.register(require('@fastify/swagger'))
// server.register(require("@fastify/autoload"), {
//     dir: path.join(__dirname, 'routes')
//   });

console.log("[*] Registering plugins");
server.register(blipp);
server.register(formBody);

console.log("[*] Registering hooks");
server.addHook("preHandler", async (request, reply) => {
  let authorizationHeader: string | undefined = request.headers?.authorization;

  let authorizationToken: string | undefined = undefined;
  if (authorizationHeader) {
    authorizationToken = authorizationHeader.replace("Basic ", "");
  }

  // if (!authorizationToken) {
  //     return reply.status(401).send('Unauthorized! LOL NOOB');
  // }
  await validateRequest(request);
});

console.log("[*] Registering routes");

server.get("/", async () => {
  return {
    name: "priority-service",
  };
});

server.register(interrogationRequestRoute);
server.register(import("./routes/interrogation/battery-data"));
server.register(import("./routes/rules/active-rules"));
server.register(import("./routes/rules/all-rules"));
server.register(import("./routes/rules/create-rule"));
server.register(import("./routes/interrogation/all-interrogations"));

console.log("[*] Preparing to start server");

const start = async (PORT: number | string) => {
  try {
    console.log("[*] Starting server");
    await server.listen(PORT, "0.0.0.0");
    console.log(
      `[*] Server started and running on port http://localhost:${PORT}`
    );
    server.blipp();
    return {
      cleanup: server.close,
    };
  } catch (err: any) {
    logger.error(err);
    process.exit(1);
  }
};

console.log("[*] Registering error handlers");

process.on("uncaughtException", (error) => {
  console.error(error);
});
process.on("unhandledRejection", (error) => {
  console.error(error);
  logger.error("UnhandledRejection", { error });
});

if (require.main === module) {
  start(env.PORT).then((r) =>
    logger.log("[*] Server started and running on port " + env.PORT)
  );
}

export { server };
