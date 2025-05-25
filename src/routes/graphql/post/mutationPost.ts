import { Post } from '@prisma/client';
import { Context } from '../types/context.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLNonNull } from 'graphql';
import { PostType } from './typePost.js';
import { ChangePostInput, CreatePostInput } from './inputPost.js';
import { ChangePostInputType, CreatePostInputType } from '../types/input.js';

export const PostMutations = {
  createPost: {
    type: PostType,
    args: { dto: { type: new GraphQLNonNull(CreatePostInput) } },
    resolve: async (__: unknown, { dto }: CreatePostInputType, { prisma }: Context) =>
      await prisma.post.create({ data: dto }),
  },

  changePost: {
    type: PostType,
    args: { id: { type: new GraphQLNonNull(UUIDType) }, dto: { type: ChangePostInput } },
    resolve: async (__: unknown, { id, dto }: ChangePostInputType, { prisma }: Context) =>
      await prisma.post.update({ where: { id }, data: dto }),
  },

  deletePost: {
    type: UUIDType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (__: unknown, { id }: Pick<Post, 'id'>, { prisma }: Context) => {
      await prisma.post.delete({ where: { id } });
      return id;
    },
  },
};
