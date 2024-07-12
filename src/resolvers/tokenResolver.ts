import Tokens, { Token } from '../models/token';
import crypto from 'crypto';
import Users from '../models/user';

const tokenResolver = {
  Query: {
    tokens: async () => {
      const tokens = await Tokens.find();

      if (tokens.length === 0) {
        throw new Error('No token found');
      }

      return tokens;
    },

    token: async (_: unknown, args: { id: Token }) => {
      const token = await Tokens.findById(args.id);

      if (token === null) {
        throw new Error('Token not found');
      }

      return token;
    },
  },

  Mutation: {
    new: async (_: unknown, args: { email: string }) => {
      const user = await Users.findOne({ email: args.email });
      const existingToken = await Tokens.findOne({
        user: user ? user._id : undefined,
      });

      let code = '';

      for (let i = 0; i < 6; i++) {
        const int = crypto.randomInt(1, 9);
        code += int;
      }

      // One-hour expiration time
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

      const data: Omit<Token, '_id'> = {
        code: Number(code),
        expiresAt: expiresAt,
        user: user?._id as unknown as any,
      };

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
    verify: async (
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
        case Date.now() > Number(token?.expiresAt):
          throw new Error('Token has expired');
        case args.payload.code !== token?.code:
          throw new Error('Invalid code');
      }

      const deletedToken = await Tokens.findByIdAndDelete(token._id);
      return deletedToken;
    },
  },
};

export default tokenResolver;
