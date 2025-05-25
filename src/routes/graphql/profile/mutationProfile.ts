import { Profile } from '@prisma/client';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ProfileType } from './typeProfile.js';
import { ChangeProfileInput, CreateProfileInput } from './inputProfile.js';
import { ChangeProfileInputType, CreateProfileInputType } from '../types/input.js';

export const ProfileMutations = {
  createProfile: {
    type: ProfileType as GraphQLObjectType,
    args: { dto: { type: new GraphQLNonNull(CreateProfileInput) } },
    resolve: async (__: unknown, { dto }: CreateProfileInputType, { prisma }: Context) =>
      await prisma.profile.create({ data: dto }),
  },

  changeProfile: {
    type: ProfileType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: ChangeProfileInput },
    },
    resolve: async (
      __: unknown,
      { id, dto }: { id: string; dto: ChangeProfileInputType },
      { prisma }: Context,
    ) => await prisma.profile.update({ where: { id }, data: dto }),
  },

  deleteProfile: {
    type: UUIDType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (__: unknown, { id }: Pick<Profile, 'id'>, { prisma }: Context) => {
      await prisma.profile.delete({ where: { id } });
      return id;
    },
  },
};
