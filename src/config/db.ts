/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {PrismaClient} from '@prisma/client';

const db: PrismaClient = new PrismaClient();

export default db;
