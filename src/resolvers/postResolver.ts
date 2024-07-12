import Posts, { Post } from '../models/post';

const postResolver = {
  Query: {
    posts: async () => {
      const posts = await Posts.find();

      if (posts.length === 0) {
        throw new Error('No posts found');
      }

      return posts;
    },
    post: async (_: unknown, args: { id: Post['_id'] }) => {
      const post = await Posts.findById(args.id);

      if (post === null) {
        throw new Error('Post not found');
      }

      return post;
    },
  },

  Mutation: {
    createPost: async (
      _: unknown,
      args: { payload: Omit<Post, '_id' | 'createdAt'> }
    ) => {
      let post = await Posts.findOne({ title: args.payload.title });

      if (post !== null) {
        throw new Error('Article or post with that title already exists');
      } else {
        post = new Posts(args.payload);
        await post.save();
      }

      return post;
    },

    updatePost: async (
      _: unknown,
      args: {
        id: Post['_id'];
        payload: Omit<Partial<Post>, '_id' | 'createdAt'>;
      }
    ) => {
      let post = await Posts.findByIdAndUpdate(args.id, args.payload, {
        new: true,
      });

      if (post === null) {
        throw new Error('Post not found');
      }

      return post;
    },

    deletePost: async (_: unknown, args: { id: Post['_id'] }) => {
      const post = await Posts.findByIdAndDelete(args.id, { new: true });

      if (post === null) {
        throw new Error('Post not found');
      }

      return post;
    },
  },
};

export default postResolver;
