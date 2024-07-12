import Users, { User } from '../models/user';

const userResolver = {
  Query: {
    users: async () => {
      const users = await Users.find();

      if (users.length === 0) {
        throw new Error('No users found');
      }
      return users;
    },
    user: async (_: any, args: { id: User['_id'] }) => {
      const user = await Users.findById(args.id);

      if (user === null) {
        throw new Error('Could not find user');
      }

      return user;
    },
  },
  Mutation: {
    updateUser: async (
      _: any,
      args: {
        id: User['_id'];
        payload: Pick<Partial<User>, 'firstName' | 'lastName'>;
      }
    ) => {
      const user = await Users.findByIdAndUpdate(args.id, args.payload, {
        new: true,
      });

      if (user === null) {
        throw new Error('Could not find user');
      }

      return user;
    },
    deleteUser: async (_: any, args: { id: User['_id'] }) => {
      const user = await Users.findByIdAndDelete(args.id, { new: true });

      if (user === null) {
        throw new Error('Could not find user');
      }
      return user;
    },
  },
};

export default userResolver;
