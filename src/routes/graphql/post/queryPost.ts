import { GraphQLList, GraphQLNonNull } from 'graphql';
import { PostType } from './typePost.js';
import { UUIDType } from '../types/uuid.js';
import { Post } from '@prisma/client';
import { Context } from '../types/context.js';

export const PostQueries = {
  post: {
    type: new GraphQLNonNull(PostType),
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (__: unknown, args: Post, { prisma }: Context) => {
      const { id } = args;
      const post = await prisma.post.findUnique({ where: { id } });
      return post;
    },
  },

  posts: {
    type: new GraphQLList(PostType),
    resolve: async (__: unknown, _: unknown, { prisma }: Context) => {
      const posts = await prisma.post.findMany();
      return posts;
    },
  },
};
