import { PrismaClient } from '@prisma/client';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const db = new PrismaClient();

export default db;