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
    id: { type: UUIDType },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    userId: { type: UUIDType },
    memberTypeId: { type: MemberTypeIdEnum },
    user: {
      type: UserType,
      resolve: async (source: Profile, __: unknown, { prisma }: Context) => {
        const { userId } = source;
        return prisma.user.findUnique({ where: { id: userId } });
      },
    },
    memberType: {
      type: new GraphQLNonNull(MemberType),
      resolve: async (source: Profile, __: unknown, { prisma }: Context) => {
        const { memberTypeId } = source;
        return prisma.memberType.findUnique({ where: { id: memberTypeId } });
      },
    },
  }),
});
