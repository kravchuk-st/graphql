import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UserType } from './typeUser.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { User } from '@prisma/client';

export const UserQueries = {
  user: {
    type: UserType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_: unknown, { id }: User, { prisma }: Context) =>
      await prisma.user.findUnique({ where: { id } }),
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async (_: unknown, __: unknown, { prisma }: Context) =>
      await prisma.user.findMany(),
  },
};
