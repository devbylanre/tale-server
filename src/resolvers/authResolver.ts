import User, { UserType } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import Tokens from '../models/token';

const authResolver = {
  Mutation: {
    signUp: async (_: any, args: { payload: UserType }) => {
      const emailAlreadyExist = await User.findOne({
        email: args.payload.email,
      });
      if (emailAlreadyExist !== null) {
        throw new Error('email already exists');
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(
        args.payload.password,
        saltRound
      );

      const user = new User({
        password: hashedPassword,
        email: args.payload.email,
        firstName: args.payload.firstName,
        lastName: args.payload.lastName,
      });

      await user.save();
      return user;
    },
    signIn: async (_: unknown, args: { payload: UserType }) => {
      const user = await User.findOne({ email: args.payload.email });

      if (user === null) {
        throw new Error('Unable to find user');
      }

      const isPasswordValid = await bcrypt.compare(
        args.payload.password,
        user.toObject().password
      );

      if (!isPasswordValid) {
        throw new Error('Invalid password provided');
      }

      const accessToken = jwt.sign(
        { userId: user.toObject()._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: '1h' }
      );
      const refreshToken = jwt.sign(
        { userId: user.toObject()._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: '3d' }
      );

      return { accessToken, refreshToken };
    },
    resetEmail: async (_: unknown, args: { email: UserType['email'] }) => {
      const user = await User.findOne({ email: args.email });

      if (user === null) {
        throw new Error('Could not find user');
      }

      let code = '';
      for (let i = 0; i < 6; i++) {
        const random = crypto.randomInt(1, 9);
        code += random.toString();
      }

      // 24 hour expiration
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);

      let token = await Tokens.findOne({ userId: user._id });

      const payload = {
        code: Number(code),
        userId: user._id,
        expiresAt: expiresAt,
      };

      if (token !== null) {
        token = await Tokens.findByIdAndUpdate(token.id, payload, {
          new: true,
        });
      } else {
        token = new Tokens(payload);
        token.save();
      }

      return token;
    },
    resetPassword: async (_: unknown, args: { email: UserType['email'] }) => {
      const user = await User.findOne({ email: args.email });

      if (user === null) {
        throw new Error('Unable to find user');
      }

      let code = '';
      for (let i = 0; i < 6; i++) {
        const int = crypto.randomInt(1, 9);
        code += int;
      }

      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
      const payload = {
        code: code,
        userId: user._id,
        expiresAt: expiresAt,
      };

      let token = await Tokens.findOne({ userId: user._id });

      if (token !== null) {
        token = await Tokens.findByIdAndUpdate(token._id, payload, {
          new: true,
        });
      } else {
        token = new Tokens(payload);
        await token.save();
      }

      return token;
    },
    changePassword: async (
      _: unknown,
      args: {
        payload: {
          userId: UserType['_id'];
          oldPassword: UserType['password'];
          newPassword: UserType['password'];
        };
      }
    ) => {
      let user = await User.findById(args.payload.userId);

      if (user === null) {
        throw new Error('Could not find user');
      }

      const isPasswordValid = await bcrypt.compare(
        args.payload.oldPassword,
        user.password
      );

      if (!isPasswordValid) {
        throw new Error('Invalid old password');
      }

      const saltRound = 10;
      const hashedPassword = await bcrypt.hash(
        args.payload.newPassword,
        saltRound
      );

      user = await User.findByIdAndUpdate(user._id, {
        password: hashedPassword,
      });

      if (user === null) {
        throw new Error('Error updating user password');
      }

      return user;
    },
    changeEmail: async (
      _: unknown,
      args: { payload: { userId: UserType['_id']; email: UserType['email'] } }
    ) => {
      let user = await User.findById(args.payload.userId);

      if (user === null) {
        throw new Error('Could not find user');
      }

      user = await User.findByIdAndUpdate(
        user._id,
        {
          email: args.payload.email,
        },
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
