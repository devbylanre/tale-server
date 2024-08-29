import authorization from '../middlewares/authorization';
import Tokens, { Token } from '../models/token';
import Users from '../models/user';
import date from '../utils/date';
import random from '../utils/random';

const tokenResolver = {
  Query: {
    tokens: authorization.permit('canReadTokens')(async () => {
      const tokens = await Tokens.find();

      if (tokens.length === 0) {
        throw new Error('No token found');
      }

      return tokens;
    }),

    token: authorization.permit('canReadTokens')(
      async (_: unknown, args: { id: Token }) => {
        const token = await Tokens.findById(args.id);

        if (token === null) {
          throw new Error('Token not found');
        }

        return token;
      }
    ),
  },

  Token: {
    user: async (parent: Token) => {
      const user = await Users.findById(parent.user);
      return user;
    },
  },

  Mutation: {
    generateToken: async (_: unknown, args: { email: string }) => {
      const user = await Users.findOne({ email: args.email });
      const existingToken = await Tokens.findOne({
        user: user ? user._id : undefined,
      });

      const code = random.ints();
      const expiresAt = date.at(); // 15 minute expiration time

      const data: Omit<Token, '_id'> | {} = user
        ? {
            code: code,
            expiresAt: expiresAt,
            user: user._id as unknown as any,
          }
        : {};

      switch (true) {
        case user === null:
          throw new Error('User not found');
        case existingToken !== null:
          const oldToken = await Tokens.findOneAndUpdate(
            { user: user._id },
            data,
            { new: true }
          );
          return oldToken;
        case existingToken === null:
          const newToken = new Tokens(data);
          await newToken.save();

          return newToken;
      }
    },
    verifyToken: async (
      _: unknown,
      args: { email: string; payload: Pick<Token, 'code'> }
    ) => {
      const user = await Users.findOne({ email: args.email });
      const token = await Tokens.findOne({ user: user ? user._id : undefined });

      switch (true) {
        case user === null:
          throw new Error('User not found');
        case token === null:
          throw new Error('User has no token');
        case Date.now() > Number(token ? token.expiresAt : 0):
          throw new Error('Token has expired');
        case args.payload.code !== (token ? token.code : 0):
          throw new Error('Invalid code');
      }

      const deletedToken = await Tokens.findByIdAndDelete(token._id);
      return deletedToken;
    },
  },
};

export default tokenResolver;
