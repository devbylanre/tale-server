import Users, { User } from '../models/user';
import bcrypt from 'bcrypt';
import tokenize from '../utils/token';
import { Response } from 'express';
import authorize from '../middlewares/authorizeMiddleware';
import str from '../utils/str';

const authResolver = {
  Query: {
    refreshToken: authorize.roles()(
      async (_: unknown, __: unknown, context: any) => {
        const refreshToken = context.req.cookies['refreshToken'];

        if (!refreshToken) {
          throw new Error('Your session has expired. Try logging in again');
        }

        const user = tokenize.verify(
          refreshToken,
          process.env.REFRESH_TOKEN as string
        );

        if (!user) {
          throw new Error('Invalid refresh token');
        }

        const accessToken = tokenize.sign('access', user);

        return { accessToken, refreshToken };
      }
    ),
  },

  Mutation: {
    signUp: async (
      _: any,
      args: { payload: Omit<User, '_id' | 'status' | 'role'> }
    ) => {
      const emailAlreadyExist = await Users.findOne({
        email: args.payload.email,
      });

      if (emailAlreadyExist !== null) {
        throw new Error('Email already exists');
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(
        args.payload.password,
        saltRound
      );

      const user = new Users({
        password: hashedPassword,
        email: args.payload.email,
        firstName: args.payload.firstName,
        lastName: args.payload.lastName,
      });

      await user.save();
      return user;
    },

    signIn: async (
      _: unknown,
      args: {
        payload: Pick<User, 'email' | 'password'> & { persist?: boolean };
      },
      context: { res: Response }
    ) => {
      const user = await Users.findOne({ email: args.payload.email });

      if (user === null) {
        throw new Error('Unable to find user');
      }

      const isPasswordValid = await bcrypt.compare(
        args.payload.password,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Password is incorrect');
      }

      const accessToken = tokenize.sign('access', {
        id: user._id,
        role: user.role,
      });
      const refreshToken = tokenize.sign('refresh', {
        id: user._id,
        role: user.role,
      });

      const MAX_AGE = 2.592 * 10 ** 9;
      context.res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        maxAge: args.payload.persist ? MAX_AGE : undefined,
      });

      return { accessToken, refreshToken };
    },

    changePassword: async (
      _: unknown,
      args: {
        payload: {
          email: User['email'];
          password: User['password'];
        };
      }
    ) => {
      const existingUser = await Users.findOne({ email: args.payload.email });

      if (existingUser === null) {
        throw new Error('Could not find user');
      }

      const isPreviousPassword = await bcrypt.compare(
        args.payload.password,
        existingUser.password
      );

      if (isPreviousPassword) {
        throw new Error('Password is already in use');
      }

      const hashedPassword = await bcrypt.hash(args.payload.password, 10);

      const user = await Users.findOneAndUpdate(
        { email: args.payload.email },
        { password: hashedPassword },
        { new: true }
      );

      return user;
    },

    changeEmail: async (
      _: unknown,
      args: { payload: { email: User['email']; newEmail: User['email'] } }
    ) => {
      const existingUser = await Users.findOne({ email: args.payload.email });

      if (existingUser === null) {
        throw new Error('Could not find user');
      }

      if (str.compare(existingUser.email, args.payload.newEmail)) {
        throw new Error('Email is already in use');
      }

      const user = await Users.findOneAndUpdate(
        { email: args.payload.email },
        { email: args.payload.newEmail },
        { new: true }
      );

      return user;
    },
  },
};

export default authResolver;
