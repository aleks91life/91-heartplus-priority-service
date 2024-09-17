import fastify, { FastifyInstance } from 'fastify';
import blipp from 'fastify-blipp';

import env from './env';
import { logger } from './utils';
import { validateRequest } from './utils/auth';
import interrogationRequestRoute from './routes/interrogationRequest';
import formBody from '@fastify/formbody';
import priorityRules from './routes/priorityRules';

const server: FastifyInstance = fastify();

server.register(blipp);
server.register(formBody);

// server.addHook('preHandler', async (request, reply) => {
//     let authorizationHeader: string | undefined = request.headers?.authorization;

//     let authorizationToken: string | undefined = undefined;
//     if(authorizationHeader) {
//         authorizationToken = authorizationHeader.replace('Basic ', '');
//     }

//     if (!authorizationToken) {
//         return reply.status(401).send('Unauthorized!');
//     }
//     await validateRequest(request);
// });

server.get('/', async () => {
    return {
        name: 'priority-service',
    };
});



server.register(interrogationRequestRoute);
server.register(priorityRules);
const start = async (PORT: number | string) => {
    try {
        await server.listen(PORT, '0.0.0.0');
        console.log(`Running on http://0.0.0.0:${PORT}/`);
        server.blipp();
        return {
            cleanup: server.close,
        };
    } catch (err: any) {
        logger.error(err);
        process.exit(1);
    }
};

process.on('uncaughtException', (error) => {
    console.error(error);
});
process.on('unhandledRejection', (error) => {
    console.error(error);
    logger.error('UnhandledRejection', { error });
});

if (require.main === module) {
    start(env.PORT)
        .then(r => logger.log('Server started.'));
}

export { server };
