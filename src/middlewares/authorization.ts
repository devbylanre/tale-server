import { GraphQLError, GraphQLFieldResolver } from 'graphql';
import tokenize from '../utils/token';
import Users, { User } from '../models/user';
import Roles from '../models/role';
import { Capability } from '../models/capability';

const authorization = {
  token: (authorization: string | undefined) => {
    // throw error if authorization is not valid
    if (!authorization) {
      throw new GraphQLError(
        'Unauthorized request: Authorization token missing.',
        {
          extensions: { code: 'AUTHORIZATION_ERROR' },
        }
      );
    }

    // store bearer token and verify token
    const token = authorization.split(' ')[1];
    const user = tokenize.verify(token, process.env.ACCESS_TOKEN as string);

    // check if user is not valid
    if (!user) {
      throw new GraphQLError(
        'Unauthorized request: unable to complete authorization, try again later ',
        { extensions: { code: 'AUTHORIZATION_ERROR' } }
      );
    }
    return user;
  },

  hasCapability: async (userId: string, requiredCapability: string) => {
    // find the user document
    const userDocument = await Users.findById(userId);

    // throw error if user document is not found
    if (!userDocument) {
      throw new GraphQLError('Unauthorized request: User not found.', {
        extensions: { code: 'USER_NOT_FOUND' },
      });
    }

    // find user role
    const role = await Roles.findById(userDocument.role).populate(
      'capabilities'
    );

    // throw error if role document is not found
    if (!role) {
      throw new GraphQLError('Unauthorized request: Role not found.', {
        extensions: { code: 'ROLE_NOT_FOUND' },
      });
    }

    // check if user has the required capability in their role
    const hasCapability = (role.capabilities as unknown as Capability[]).some(
      (capability) => capability.name === requiredCapability
    );

    // throw error if user does not have the required capability
    if (!hasCapability) {
      throw new GraphQLError(
        `Restricted resource: you cannot access this resource as ${role.name}`,
        { extensions: { code: 'ROLE_ERROR' } }
      );
    }
  },

  grant: () => {
    return (
      resolve: GraphQLFieldResolver<any, any, any>
    ): GraphQLFieldResolver<any, any, any> => {
      return (source, args, context, info) => {
        const { req } = context;

        const user = authorization.token(req.headers.authorization);

        context.user = user;

        return resolve(source, args, context, info);
      };
    };
  },

  permit: (requiredCapability: string) => {
    return (
      resolve: GraphQLFieldResolver<any, any, any>
    ): GraphQLFieldResolver<any, any, any> => {
      return authorization.grant()(async (source, args, context, info) => {
        const { user } = context;

        await authorization.hasCapability(user.id, requiredCapability);
        return resolve(source, args, context, info);
      });
    };
  },
};

export default authorization;
