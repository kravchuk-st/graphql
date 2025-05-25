import {
  GraphQLFloat,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLEnumType,
} from 'graphql';

import { Context } from '../types/context.js';
import { ProfileType } from '../profile/typeProfile.js';
import { MemberType as PrismaMemberType } from '@prisma/client';

enum MemberTypeId {
  BASIC = 'basic',
  BUSINESS = 'business',
}

export const MemberTypeIdEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: { value: MemberTypeId.BASIC },
    business: { value: MemberTypeId.BUSINESS },
  },
});

export const MemberType = new GraphQLObjectType({
  name: 'MemberType',
  description: 'MemberType data',
  fields: () => ({
    id: { type: MemberTypeIdEnum },
    discount: { type: GraphQLFloat },
    postsLimitPerMonth: { type: GraphQLInt },
    profiles: {
      type: new GraphQLList(ProfileType),
      resolve: async (source: PrismaMemberType, __: unknown, { prisma }: Context) => {
        const { id } = source;
        const member = await prisma.profile.findMany({ where: { memberTypeId: id } });
        return member;
      },
    },
  }),
});
