import Users, { User } from '../models/user';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

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
      args: { payload: Pick<User, 'email' | 'password'> }
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
        throw new Error('Invalid password provided');
      }

      const accessToken = jwt.sign(
        { userId: user.toObject()._id },
        process.env.ACCESS_TOKEN as string,
        { expiresIn: 30 }
      );
      const refreshToken = jwt.sign(
        { userId: user.toObject()._id },
        process.env.REFRESH_TOKEN as string,
        { expiresIn: '3d' }
      );

      return { accessToken, refreshToken };
    },
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
