import { GraphQLError, GraphQLFieldResolver } from 'graphql';
import Users, { User } from '../models/user';

const authorize = {
  is: () => {
    return (
      resolve: GraphQLFieldResolver<any, any, any>
    ): GraphQLFieldResolver<any, any, any> => {
      return (source, args, context, info) => {
        const { user } = context;

        if (!user) {
          throw new GraphQLError(
            'Unauthorized request: Provide your authorization token.',
            { extensions: { code: 'AUTHORIZATION_ERROR' } }
          );
        }

        return resolve(source, args, context, info);
      };
    };
  },
  roles: (
    roles: User['role'][] = ['admin', 'developer', 'developer', 'reader']
  ) => {
    return (
      resolve: GraphQLFieldResolver<any, any, any>
    ): GraphQLFieldResolver<any, any, any> => {
      return authorize.is()((source, args, context, info) => {
        const {
          user: { role },
        } = context;

        if (!roles.includes(role)) {
          throw new GraphQLError(
            'Access revoked: you tried accessing a restricted resource',
            { extensions: { code: 'ROLE_ERROR' } }
          );
        }

        return resolve(source, args, context, info);
      });
    };
  },
};

export default authorize;
