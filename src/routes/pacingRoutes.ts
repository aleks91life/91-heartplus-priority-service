import { FastifyPluginCallback } from 'fastify';
//import { interpretPacingRule , priorityEngine } from '../priorityEngine/pacingInterpreter';
import { priorityEngine2 } from '../priorityEngine/priorityCalculationEngine';



type PacingInterpretRequest = {
    Body: {
        rule: any; // Replace `any` with the actual Rule type (toDo later)
        transmission: any; // Replace `any` with the actual Transmission type (toDO later)
    };
};


type PriorityEngineRequest = {
    Body: {
        //rules: any[]; // Replace `any` with the actual Rule type (toDo later)
        transmission: any; // Replace `any` with the actual Transmission type (toDo later)
    };
};




const pacingRoutes: FastifyPluginCallback = (server, opts, done) => {
    // POST: Interpret pacing rule
    // server.route<PacingInterpretRequest>({
    //     url: '/pacing-rule/interpret',
    //     method: 'POST',
    //     schema: {
    //         body: {
    //             type: 'object',
    //             properties: {
    //                 rule: { type: 'object' },
    //                 transmission: { type: 'object' }
    //             },
    //             required: ['rule', 'transmission']
    //         }
    //     },
    //     handler: async (request, reply) => {
    //         try {
    //             const { rule, transmission } = request.body;
    //             const results = interpretPacingRule(rule, transmission);
    //             reply.send(results);
    //         } catch (error) {
    //             reply.status(500).send('Internal Server Error');
    //         }
    //     }
    // });


    // POST: Interpret priority rules
    // server.route<PriorityEngineRequest>({
    //     url: '/priority-engine/interpret',
    //     method: 'POST',
    //     schema: {
    //         body: {
    //             type: 'object',
    //             properties: {
                    
    //                 transmission: { type: 'object' }
    //             },
    //             required: ['transmission']
    //         }
    //     },
    //     handler: async (request, reply) => {
    //         try {
    //             const { transmission } = request.body;
    //             const results = await priorityEngine(transmission); // Use the priorityEngine
    //             reply.send(results);
    //         } catch (error) {
    //             reply.status(500).send('Internal Server Error');
    //         }
    //     }
    // });



    server.route<PriorityEngineRequest>({
        url: '/priority-engine/interpret2',
        method: 'POST',
        schema: {
            body: {
                type: 'object',
                properties: {
                    
                    transmission: { type: 'object' }
                },
                required: ['transmission']
            }
        },
        handler: async (request, reply) => {
            try {
                const { transmission } = request.body;
                const results = await priorityEngine2(transmission); // Use the priorityEngine
                reply.send(results);
            } catch (error) {
                reply.status(500).send('Internal Server Error');
            }
        }
    });



    done();
};

export default pacingRoutes;
