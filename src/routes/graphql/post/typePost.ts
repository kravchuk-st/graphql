import { GraphQLNonNull, GraphQLObjectType, GraphQLString } from 'graphql';
import { Context } from '../types/context.js';
import { Post } from '@prisma/client';
import { UUIDType } from '../types/uuid.js';
import { UserType } from '../user/typeUser.js';

export const PostType = new GraphQLObjectType({
  name: 'Post',
  description: 'Post data',
  fields: () => ({
    id: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
    authorId: { type: new GraphQLNonNull(UUIDType) },
    author: {
      type: UserType as GraphQLObjectType,
      resolve: async ({ authorId }: Post, __: unknown, { prisma }: Context) =>
        await prisma.user.findUnique({ where: { id: authorId } }),
    },
  }),
});
