import User, { UserType } from '../models/user';

const userResolver = {
  Query: {
    users: async () => {
      const users = await User.find();

      if (users.length === 0) {
        throw new Error('No users found');
      }
      return users;
    },
    user: async (_: any, args: { userId: UserType['_id'] }) => {
      const user = await User.findById(args.userId);

      if (user === null) {
        throw new Error('Could not find user');
      }

      return user;
    },
  },
  Mutation: {
    updateUser: async (
      _: any,
      args: { userId: UserType['_id']; data: Partial<UserType> }
    ) => {
      const user = await User.findByIdAndUpdate(args.userId, args.data, {
        new: true,
      });

      if (user === null) {
        throw new Error('Could not find user');
      }

      return user;
    },
    deleteUser: async (_: any, args: { userId: UserType['_id'] }) => {
      const user = await User.findByIdAndDelete(args.userId, { new: true });

      if (user === null) {
        throw new Error('Could not find user');
      }
      return user;
    },
  },
};

export default userResolver;
