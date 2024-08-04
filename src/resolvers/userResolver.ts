import authorize from '../middlewares/authorizeMiddleware';
import Comments from '../models/comment';
import Posts from '../models/post';
import Medias from '../models/media';
import Users, { User } from '../models/user';

const userResolver = {
  Query: {
    users: authorize.roles(['admin', 'developer'])(async () => {
      const users = await Users.find();

      if (users.length === 0) {
        throw new Error('No users found');
      }
      return users;
    }),
    user: authorize.roles()(async (_: any, __: any, context: any) => {
      const ID = context.user.id;
      const user = await Users.findById(ID);

      if (user === null) {
        throw new Error('Could not find user');
      }

      return user;
    }),
  },

  User: {
    image: async (parent: User) => {
      const media = await Medias.findById(parent.image);
      return media;
    },
    posts: async (parent: User) => {
      const posts = await Posts.find({ author: parent._id });
      return posts;
    },
    comments: async (parent: User) => {
      const comments = await Comments.find({ author: parent._id });
      return comments;
    },
    medias: async (parent: User) => {
      const medias = await Medias.find({ user: parent._id }).populate('user');
      return medias;
    },
  },

  Mutation: {
    updateUser: authorize.roles()(
      async (
        _: any,
        args: {
          id: User['_id'];
          payload: Omit<Partial<User>, 'email' | 'password' | '_id'>;
        }
      ) => {
        const user = await Users.findByIdAndUpdate(args.id, args.payload, {
          new: true,
        });

        if (user === null) {
          throw new Error('Could not find user');
        }

        return user;
      }
    ),
    deleteUser: authorize.roles()(async (_: any, args: { id: User['_id'] }) => {
      const user = await Users.findByIdAndDelete(args.id, { new: true });

      if (user === null) {
        throw new Error('Could not find user');
      }
      return user;
    }),
  },
};

export default userResolver;
