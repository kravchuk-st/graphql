import { GraphQLList, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { Context } from '../types/context.js';
import { MemberTypeIdEnum } from './typeMember.js';
import { MemberType as PrismaMemberType } from '@prisma/client';
import { MemberType } from './typeMember.js';

export const MemberTypeQueries = {
  memberType: {
    type: MemberType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    },
    resolve: async (__: unknown, { id }: PrismaMemberType, { prisma }: Context) =>
      await prisma.memberType.findUnique({ where: { id } }),
  },

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async (__: unknown, _: unknown, { prisma }: Context) =>
      await prisma.memberType.findMany(),
  },
};
