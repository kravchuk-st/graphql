import { GraphQLBoolean, GraphQLInt, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Profile } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../user/typeUser.js';
import { Context } from '../types/context.js';
import { MemberType, MemberTypeIdEnum } from '../memberType/typeMember.js';

export const ProfileType = new GraphQLObjectType({
  name: 'Profile',
  description: 'Profile data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
    user: {
      type: UserType as GraphQLObjectType,
      resolve: async ({ userId }: Profile, __: unknown, { prisma }: Context) =>
        await prisma.user.findUnique({ where: { id: userId } }),
    },
    memberType: {
      type: MemberType as GraphQLObjectType,
      resolve: async ({ memberTypeId }: Profile, __: unknown, { prisma }: Context) =>
        await prisma.memberType.findUnique({ where: { id: memberTypeId } }),
    },
  }),
});
