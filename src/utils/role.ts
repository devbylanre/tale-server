import { GraphQLError, GraphQLFieldResolver } from 'graphql';
import { User } from '../models/user';

type Context = Record<string, any>;

const checkUserRole = (roles: User['role'][]) => {
  return <TArgs = any, TSource = any>(
    resolve: GraphQLFieldResolver<TSource, Context, TArgs>
  ): GraphQLFieldResolver<TSource, Context, TArgs> => {
    return (parent, args, context, info) => {
      if (context.user !== null) {
        if (roles.includes(context.user.role)) {
          return resolve(parent, args, context, info);
        }
      } else {
        throw new GraphQLError('Authorization token is missing or invalid', {
          extensions: { code: 'AUTHORIZATION_ERROR' },
        });
      }
      throw new GraphQLError(
        'Access revoked: you tried accessing a restricted resource',
        { extensions: { code: 'RESOURCE_ERROR' } }
      );
    };
  };
};

export { checkUserRole };
