import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Context } from '../types/context.js';
import { ProfileType } from './typeProfile.js';
import { Profile } from '@prisma/client';

export const ProfileQueries = {
  profile: {
    type: ProfileType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_: unknown, { id }: Profile, { prisma }: Context) =>
      await prisma.profile.findUnique({ where: { id } }),
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_: unknown, __: unknown, { prisma }: Context) =>
      await prisma.profile.findMany(),
  },
};
