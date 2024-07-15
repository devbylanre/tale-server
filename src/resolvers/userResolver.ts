import Comments from '../models/comment';
import Posts from '../models/post';
import Uploads from '../models/upload';
import Users, { User } from '../models/user';
import { checkUserRole } from '../utils/role';

const userResolver = {
  Query: {
    users: checkUserRole(['admin', 'developer'])(async () => {
      const users = await Users.find();

      if (users.length === 0) {
        throw new Error('No users found');
      }
      return users;
    }),
    user: async (_: any, args: { id: User['_id'] }) => {
      const user = await Users.findById(args.id);

      if (user === null) {
        throw new Error('Could not find user');
      }

      return user;
    },
  },

  User: {
    image: async (parent: User) => {
      const image = await Uploads.findById(parent.image);
      return image;
    },
    posts: async (parent: User) => {
      const posts = await Posts.find({ author: parent._id });
      return posts;
    },
    comments: async (parent: User) => {
      const comments = await Comments.find({ author: parent._id });
      return comments;
    },
    uploads: async (parent: User) => {
      const uploads = await Uploads.find({ user: parent._id }).populate('user');
      return uploads;
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
