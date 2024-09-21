import fp from 'fastify-plugin';
import fastify, { FastifyPluginCallback } from 'fastify';
import { PrismaClient } from '@prisma/client';
import { InterrogationRequestType } from '../../types';

interface Params {
    id: string;
  }



export default fp(async (server) => {

    const prisma = new PrismaClient();

    server.get('/interrogation/:id/battery-data', async (request, reply) => {
        const params = request.params as Params;
        const { id } = params;      
        try {
          const interrogation = await prisma.interrogation.findUnique({
            where: { id: parseInt(id) },
          });
      
          if (!interrogation) {
            return reply.code(404).send({ error: 'Interrogation not found :(' });
          }
      
          // Extract battery measurements from the JSON data

          const interrogationData = interrogation.data as InterrogationRequestType;

          const batteryData = interrogationData.measurements?.batteryMeasurements;
          const batteryRemaining = batteryData?.map((battery) => battery.remainingLongevity);

          const patientData = {
            "firstName": interrogationData?.patient?.firstName,
            "lastName": interrogationData?.patient?.lastName,
            "dataOfBirth": new Date(interrogationData?.patient?.dateOfBirth ?? new Date()).toDateString(),
            "sex": interrogationData?.patient?.sex,
        }
      
          return reply.send({ batteryRemaining, patientData });
        } catch (error) {
          server.log.error(error);
          return reply.code(500).send({ error: 'An error occurred while fetching the data' });
        }
        });

      server.get('/interrogation/:id', async (request, reply) => {
        const params = request.params as Params;
        const { id } = params;
      
        try {
          const interrogation = await prisma.interrogation.findUnique({
            where: { id: parseInt(id) },
          });
      
          if (!interrogation) {
            return reply.code(404).send({ error: 'Interrogation not found :(' });
          }
      
          return reply.send(interrogation);
        } catch (error) {
          server.log.error(error);
          return reply.code(500).send({ error: 'An error occurred while fetching the data' });
        }
      });
});