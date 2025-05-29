import { GraphQLFloat, GraphQLInputObjectType, GraphQLString } from 'graphql';

export const CreateUserInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const ChangeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({ name: { type: GraphQLString }, balance: { type: GraphQLFloat } }),
});
