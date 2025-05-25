import { GraphQLList, GraphQLNonNull } from 'graphql';
import { Context } from '../types/context.js';
import { MemberTypeIdEnum } from './typeMember.js';
import { MemberType as PrismaMemberType } from '@prisma/client';
import { MemberType } from './typeMember.js';

export const MemberTypeQueries = {
  memberType: {
    type: new GraphQLNonNull(MemberType),
    args: {
      id: { type: new GraphQLNonNull(MemberTypeIdEnum) },
    },
    resolve: async (__: unknown, args: PrismaMemberType, { prisma }: Context) => {
      const { id } = args;
      const member = await prisma.memberType.findUnique({ where: { id } });
      return member;
    },
  },

  memberTypes: {
    type: new GraphQLList(MemberType),
    resolve: async (__: unknown, _: unknown, { prisma }: Context) => {
      const members = await prisma.memberType.findMany();
      return members;
    },
  },
};
