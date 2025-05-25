import { GraphQLList, GraphQLNonNull } from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { Context } from '../types/context.js';
import { ProfileType } from './typeProfile.js';
import { Profile } from '@prisma/client';

export const ProfileQueries = {
  profile: {
    type: new GraphQLNonNull(ProfileType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_: unknown, { id }: Profile, { prisma }: Context) => {
      const profile = await prisma.profile.findUnique({ where: { id } });
      return profile;
    },
  },

  profiles: {
    type: new GraphQLList(ProfileType),
    resolve: async (_: unknown, __: unknown, { prisma }: Context) => {
      const profiles = await prisma.profile.findMany();
      return profiles;
    },
  },
};
