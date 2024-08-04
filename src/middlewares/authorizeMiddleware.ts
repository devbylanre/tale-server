import { GraphQLError, GraphQLFieldResolver } from 'graphql';
import { User } from '../models/user';
import tokenize from '../utils/token';

const authorize = {
  is: () => {
    return (
      resolve: GraphQLFieldResolver<any, any, any>
    ): GraphQLFieldResolver<any, any, any> => {
      return (source, args, context, info) => {
        const { req } = context;
        const token = req.headers.authorization?.split(' ')[1];
        const user = tokenize.verify(token, process.env.ACCESS_TOKEN as string);

        if (!user) {
          throw new GraphQLError(
            'Unauthorized request: Provide your authorization token.',
            { extensions: { code: 'AUTHORIZATION_ERROR' } }
          );
        }

        return resolve(source, args, { user, ...context }, info);
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
        const { user } = context;

        if (!roles.includes(user.role)) {
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
