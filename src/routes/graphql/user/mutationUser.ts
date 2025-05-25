import { User } from '@prisma/client';
import { Context } from '../types/context.js';
import {
  ChangeUserInput,
  ChangeUserInputType,
  CreateUserInput,
  CreateUserInputType,
} from './inputUser.js';
import { UserType } from './typeUser.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLNonNull, GraphQLObjectType } from 'graphql';

export const UserMutations = {
  createUser: {
    type: UserType as GraphQLObjectType,
    args: { dto: { type: new GraphQLNonNull(CreateUserInput) } },
    resolve: async (__: unknown, { dto }: CreateUserInputType, { prisma }: Context) =>
      await prisma.user.create({ data: dto }),
  },

  changeUser: {
    type: UserType as GraphQLObjectType,
    args: {
      id: { type: new GraphQLNonNull(UUIDType) },
      dto: { type: new GraphQLNonNull(ChangeUserInput) },
    },
    resolve: async (
      __: unknown,
      { id, dto }: { id: string; dto: ChangeUserInputType },
      { prisma }: Context,
    ) => await prisma.user.update({ where: { id }, data: dto }),
  },

  deleteUser: {
    type: UUIDType,
    args: { id: { type: new GraphQLNonNull(UUIDType) } },
    resolve: async (__: unknown, { id }: Pick<User, 'id'>, { prisma }: Context) => {
      await prisma.user.delete({ where: { id } });
      return id;
    },
  },
  subscribeTo: {
    type: UserType as GraphQLObjectType,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      __: unknown,
      args: { userId: string; authorId: string },
      { prisma }: Context,
    ) => {
      const { userId, authorId } = args;
      return await prisma.user.update({
        where: { id: userId },
        data: { userSubscribedTo: { create: { authorId } } },
      });
    },
  },
  unsubscribeFrom: {
    type: UUIDType,
    args: {
      userId: { type: UUIDType },
      authorId: { type: UUIDType },
    },
    resolve: async (
      __: unknown,
      args: { userId: string; authorId: string },
      { prisma }: Context,
    ) => {
      const { userId, authorId } = args;
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            subscriberId: userId,
            authorId,
          },
        },
      });
      return userId;
    },
  },
};
