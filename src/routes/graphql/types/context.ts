import { PrismaClient } from '@prisma/client';
import { DataLoaders } from './dataLoaders.js';

export interface Context {
  prisma: PrismaClient;
  loaders: DataLoaders;
}
