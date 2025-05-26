import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { createGqlResponseSchema, gqlResponseSchema, graphQLSchema } from './schemas.js';
import { graphql, validate, parse, GraphQLError } from 'graphql';
import depthLimit from 'graphql-depth-limit';
import { initializeDataLoaders } from './dataLoader/dataLoader.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler(req) {
      const { query, variables } = req.body;
      const loaders = initializeDataLoaders(prisma);

      try {
        const validationErrors = validate(graphQLSchema, parse(query), [depthLimit(5)]);

        if (validationErrors.length > 0) {
          console.log('Maximum operation depth is 5');
          return { errors: validationErrors };
        }

        const { data, errors } = await graphql({
          schema: graphQLSchema,
          source: query,
          variableValues: variables,
          contextValue: {
            prisma,
            loaders,
          },
        });

        return { data, errors };
      } catch (error: unknown) {
        if (error instanceof GraphQLError) {
          console.error('GraphQL Error:', error.message);
          return { errors: [error] };
        } else {
          return { errors: [error] };
        }
      }
    },
  });
};

export default plugin;
