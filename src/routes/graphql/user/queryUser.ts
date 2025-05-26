import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLResolveInfo,
} from 'graphql';
import { UserType } from './typeUser.js';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { User } from '@prisma/client';
import {
  ResolveTree,
  parseResolveInfo,
  simplifyParsedResolveInfoFragmentWithType,
} from 'graphql-parse-resolve-info';

export const UserQueries = {
  user: {
    type: UserType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_: unknown, { id }: User, { loaders }: Context) =>
      await loaders.userDataLoader.load(id),
  },

  users: {
    type: new GraphQLList(UserType),
    resolve: async (
      _: unknown,
      __: unknown,
      { prisma }: Context,
      info: GraphQLResolveInfo,
    ) => {
      const parsedInfo = parseResolveInfo(info) as ResolveTree;
      const returnType = info.returnType;

      const { fields } = simplifyParsedResolveInfoFragmentWithType(
        parsedInfo,
        returnType,
      );

      const include = {};
      const includeFields = ['userSubscribedTo', 'subscribedToUser'];

      for (const field of includeFields) {
        include[field] = fields[field] !== null;
      }

      const users = await prisma.user.findMany({ include });

      return users;
    },
  },
};
