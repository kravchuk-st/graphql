import { MemberType, Post, PrismaClient, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';
import { DataLoaders } from '../types/dataLoaders.js';

export const initializeDataLoaders = (prisma: PrismaClient): DataLoaders => {
  const batchMemberTypeDataLoader = (prisma: PrismaClient) => {
    const postDataLoader: DataLoader<string, MemberType | undefined> = new DataLoader<
      string,
      MemberType | undefined
    >(async (keys: readonly string[]) => {
      const members = await prisma.memberType.findMany({
        where: { id: { in: [...keys] } },
      });

      const memberTypeByIdMap = new Map<string, MemberType>();

      members.forEach((memberType) => {
        const memberTypeId = memberType.id;

        memberTypeByIdMap.set(memberTypeId, memberType);
      });

      return keys.map((key) => memberTypeByIdMap.get(key));
    });

    return postDataLoader;
  };

  const batchPostDataLoader = (prisma: PrismaClient) => {
    const postDataLoader: DataLoader<string, Post[] | undefined> = new DataLoader<
      string,
      Post[] | undefined
    >(async (keys: readonly string[]) => {
      const posts = await prisma.post.findMany({
        where: { authorId: { in: [...keys] } },
      });

      const postsByAuthorIdMap = new Map<string, Post[]>();

      for (const post of posts) {
        const authorId = post.authorId;
        const authorPosts = postsByAuthorIdMap.get(authorId) ?? [];

        authorPosts.push(post);

        postsByAuthorIdMap.set(authorId, authorPosts);
      }

      return keys.map((key) => postsByAuthorIdMap.get(key));
    });

    return postDataLoader;
  };

  const batchProfileDataLoader = (prisma: PrismaClient) => {
    const profileDataLoader: DataLoader<string, Profile | undefined> = new DataLoader<
      string,
      Profile | undefined
    >(async (keys: readonly string[]) => {
      const profiles = await prisma.profile.findMany({
        where: { userId: { in: [...keys] } },
      });

      const profilesMap = new Map<string, Profile>();
      profiles.forEach((profile) => profilesMap.set(profile.userId, profile));

      return keys.map((id) => profilesMap.get(id));
    });

    return profileDataLoader;
  };

  const batchUserDataLoader = (prisma: PrismaClient) => {
    const userDataLoader: DataLoader<string, User | undefined> = new DataLoader<
      string,
      User | undefined
    >(async (keys: readonly string[]) => {
      const users = await prisma.user.findMany({
        where: { id: { in: [...keys] } },
      });

      const usersMap = new Map<string, User>();

      users.forEach((user) => {
        usersMap.set(user.id, user);
      });

      return keys.map((key) => usersMap.get(key));
    });

    return userDataLoader;
  };

  const batchUserSubscriptionsDataLoader = (prisma: PrismaClient) =>
    new DataLoader(async (userIds: readonly string[]) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { subscriberId: { in: [...userIds] } },
        include: { author: true },
      });

      return userIds.map((userId) =>
        subscriptions
          .filter((sub) => sub.subscriberId === userId)
          .map((sub) => sub.author),
      );
    });

  const batchUserSubscribersDataLoader = (prisma: PrismaClient) =>
    new DataLoader(async (userIds: readonly string[]) => {
      const subscriptions = await prisma.subscribersOnAuthors.findMany({
        where: { authorId: { in: [...userIds] } },
        include: { subscriber: true },
      });

      return userIds.map((userId) =>
        subscriptions
          .filter((sub) => sub.authorId === userId)
          .map((sub) => sub.subscriber),
      );
    });

  return {
    postDataLoader: batchPostDataLoader(prisma),
    memberTypeDataLoader: batchMemberTypeDataLoader(prisma),
    profileDataLoader: batchProfileDataLoader(prisma),
    userDataLoader: batchUserDataLoader(prisma),
    userSubscriptionsLoader: batchUserSubscriptionsDataLoader(prisma),
    userSubscribersLoader: batchUserSubscribersDataLoader(prisma),
  };
};
