import Comments, { Comment } from '../models/comment';
import Posts from '../models/post';
import Users from '../models/user';
import { checkUserRole } from '../utils/role';

const commentResolver = {
  Query: {
    comments: checkUserRole(['admin', 'developer'])(async () => {
      const comments = await Comments.find();

      if (comments.length === 0) {
        throw new Error('No comments found.');
      }

      return comments;
    }),
    comment: async (_: unknown, args: { id: Comment['_id'] }) => {
      const comment = await Comments.findById(args.id);

      if (comment === null) {
        throw new Error('Comment not found.');
      }

      return comment;
    },
  },

  Comment: {
    author: async (parent: Comment) => {
      const author = await Users.findById(parent.author);
      return author;
    },
    post: async (parent: Comment) => {
      const post = await Posts.findById(parent.post)
        .populate('author')
        .populate('category');
      return post;
    },
  },

  Mutation: {
    createComment: async (
      _: unknown,
      args: { payload: Omit<Comment, '_id' | 'createdAt'> }
    ) => {
      const comment = new Comments(args.payload);
      await comment.save();

      return comment;
    },
    updateComment: async (
      _: unknown,
      args: {
        id: Comment['_id'];
        payload: Pick<Partial<Comment>, 'content'>;
      }
    ) => {
      const comment = await Comments.findByIdAndUpdate(args.id, args.payload, {
        new: true,
      });

      if (comment === null) {
        throw new Error('Comment not found.');
      }

      return comment;
    },
    deleteComment: async (_: unknown, args: { id: Comment['_id'] }) => {
      const comment = await Comments.findByIdAndDelete(args.id, { new: true });

      if (comment === null) {
        throw new Error('Comment not found.');
      }

      return comment;
    },
  },
};

export default commentResolver;
