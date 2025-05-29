import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql';
import { UUIDType } from '../types/uuid.js';
import { ProfileType } from '../profile/typeProfile.js';
import { User } from '@prisma/client';
import { Context } from '../types/context.js';
import { PostType } from '../post/typePost.js';

export const UserType = new GraphQLObjectType({
  name: 'User',
  description: 'User data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: ProfileType as GraphQLObjectType,
      resolve: async ({ id }: User, __: unknown, { loaders }: Context) =>
        await loaders.profileDataLoader.load(id),
    },
    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: User, __: unknown, { loaders }: Context) =>
        await loaders.postDataLoader.load(id),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: User, __: unknown, { loaders }: Context) =>
        await loaders.userSubscriptionsLoader.load(id),
    },

    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: User, __: unknown, { loaders }: Context) =>
        await loaders.userSubscribersLoader.load(id),
    },
  }),
});
