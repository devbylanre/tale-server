import Users, { User } from '../models/user';
import bcrypt from 'bcrypt';
import cookie from 'cookie-parser';
import { checkUserRole } from '../utils/role';
import tokenize from '../utils/token';
import { Response } from 'express';

const authResolver = {
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
      args: { payload: Pick<User, 'email' | 'password'> },
      context: { res: Response }
    ) => {
      const user = await Users.findOne({ email: args.payload.email });

      if (user === null) {
        throw new Error('Unable to find user');
      }

      const isPasswordValid = await bcrypt.compare(
        args.payload.password,
        user.toObject().password
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
        maxAge: MAX_AGE,
      });

      return { accessToken, refreshToken };
    },
    refreshToken: checkUserRole(['admin', 'author', 'developer', 'reader'])(
      async (_: unknown, args: { token: string }) => {
        const refreshToken = args.token;
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
    changePassword: async (
      _: unknown,
      args: {
        email: User['email'];
        payload: {
          password: User['password'];
        };
      }
    ) => {
      let user = await Users.findOne({ email: args.email });

      if (user === null) {
        throw new Error('Could not find user');
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(
        args.payload.password,
        saltRound
      );

      user = await Users.findByIdAndUpdate(user._id, {
        password: hashedPassword,
      });

      if (user === null) {
        throw new Error('Error updating user password');
      }

      return user;
    },
    changeEmail: async (
      _: unknown,
      args: { email: User['email']; payload: { email: User['email'] } }
    ) => {
      let user = await Users.findOne({ email: args.email });

      if (user === null) {
        throw new Error('Could not find user');
      }

      user = await Users.findByIdAndUpdate(
        user._id,
        { email: args.payload.email },
        { new: true }
      );

      if (user === null) {
        throw new Error('Error updating user email');
      }

      return user;
    },
  },
};

export default authResolver;
