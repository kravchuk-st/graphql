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
      resolve: async ({ id }: User, __: unknown, { prisma }: Context) =>
        await prisma.profile.findUnique({ where: { userId: id } }),
    },

    posts: {
      type: new GraphQLList(PostType),
      resolve: async ({ id }: User, __: unknown, { prisma }: Context) =>
        await prisma.post.findMany({ where: { authorId: id } }),
    },

    userSubscribedTo: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: User, __: unknown, { prisma }: Context) =>
        await prisma.user.findMany({
          where: {
            subscribedToUser: {
              some: {
                subscriberId: id,
              },
            },
          },
        }),
    },
    subscribedToUser: {
      type: new GraphQLList(UserType),
      resolve: async ({ id }: User, __: unknown, { prisma }: Context) =>
        await prisma.user.findMany({
          where: {
            userSubscribedTo: {
              some: {
                authorId: id,
              },
            },
          },
        }),
    },
  }),
});
