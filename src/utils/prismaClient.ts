import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Enable detailed logging
});

export default prisma;
