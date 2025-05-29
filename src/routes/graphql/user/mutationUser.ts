import { User } from '@prisma/client';
import { Context } from '../types/context.js';
import { ChangeUserInput, CreateUserInput } from './inputUser.js';
import { UserType } from './typeUser.js';
import { UUIDType } from '../types/uuid.js';
import { GraphQLBoolean, GraphQLNonNull, GraphQLObjectType } from 'graphql';
import { ChangeUserInputType, CreateUserInputType } from '../types/input.js';

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
      dto: { type: ChangeUserInput },
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
    type: GraphQLBoolean,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { userId, authorId }, { prisma }) => {
      await prisma.subscribersOnAuthors.create({
        data: {
          subscriberId: userId,
          authorId: authorId,
        },
      });
      return true;
    },
  },
  unsubscribeFrom: {
    type: GraphQLBoolean,
    args: {
      userId: { type: new GraphQLNonNull(UUIDType) },
      authorId: { type: new GraphQLNonNull(UUIDType) },
    },
    resolve: async (_, { userId, authorId }, { prisma }) => {
      await prisma.subscribersOnAuthors.deleteMany({
        where: {
          subscriberId: userId,
          authorId: authorId,
        },
      });
      return true;
    },
  },
};
