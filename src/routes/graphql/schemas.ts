import { Type } from '@fastify/type-provider-typebox';
import { UserQueries } from './user/queryUser.js';
import { GraphQLObjectType, GraphQLSchema } from 'graphql';
import { UserMutations } from './user/mutationUser.js';
import { ProfileQueries } from './profile/queryProfile.js';
import { MemberTypeQueries } from './memberType/queryMember.js';
import { PostQueries } from './post/queryPost.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...UserQueries,
    ...ProfileQueries,
    ...PostQueries,
    ...MemberTypeQueries,
  }),
});

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    ...UserMutations,
  },
});

export const graphQLSchema = new GraphQLSchema({ query, mutation });
