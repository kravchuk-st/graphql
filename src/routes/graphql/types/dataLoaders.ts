import { MemberType, Post, Profile, User } from '@prisma/client';
import DataLoader from 'dataloader';

export interface DataLoaders {
  postDataLoader: DataLoader<string, Post[] | undefined>;
  memberTypeDataLoader: DataLoader<string, MemberType | undefined>;
  profileDataLoader: DataLoader<string, Profile | undefined>;
  userDataLoader: DataLoader<string, User | undefined>;
}
