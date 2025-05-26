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
import { UserSub } from '../types/subscription.js';

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
      resolve: async (
        { userSubscribedTo }: UserSub,
        __: unknown,
        { loaders }: Context,
      ) => {
        if (
          userSubscribedTo &&
          Array.isArray(userSubscribedTo) &&
          userSubscribedTo.length !== 0
        ) {
          const authorIds = userSubscribedTo.map(({ authorId }) => authorId);
          const users = await loaders.userDataLoader.loadMany(authorIds);

          return users;
        }
      },
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async (
        { subscribedToUser }: UserSub,
        __: unknown,
        { loaders }: Context,
      ) => {
        if (
          subscribedToUser &&
          Array.isArray(subscribedToUser) &&
          subscribedToUser.length !== 0
        ) {
          const subscriberIds = subscribedToUser.map(({ subscriberId }) => subscriberId);
          const users = await loaders.userDataLoader.loadMany(subscriberIds);

          return users;
        }
      },
    },
  }),
});
