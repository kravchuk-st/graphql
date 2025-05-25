import { GraphQLList, GraphQLNonNull } from 'graphql';
import { UserType } from './typeUser.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { User } from '@prisma/client';

export const UserQueries = {
  user: {
    type: new GraphQLNonNull(UserType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_: unknown, { id }: User, { prisma }: Context) => {
      const user = await prisma.user.findFirst({ where: { id } });
      return user;
    },
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async (_: unknown, __: unknown, { prisma }: Context) => {
      const users = await prisma.user.findMany();
      return users;
    },
  },
};
