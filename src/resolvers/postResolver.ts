import authorization from '../middlewares/authorization';
import Categories from '../models/category';
import Comments from '../models/comment';
import Posts, { Post } from '../models/post';
import Medias from '../models/media';
import Users from '../models/user';

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

  Post: {
    image: async (parent: Post) => {
      const image = await Medias.findById(parent.image).populate('user');
      return image;
    },
    author: async (parent: Post) => {
      const author = await Users.findById(parent.author).populate('image');
      return author;
    },
    category: async (parent: Post) => {
      const category = await Categories.findById(parent.category);
      return category;
    },
    comments: async (parent: Post) => {
      const comments = await Comments.find({ post: parent._id })
        .populate('author')
        .populate('post');
      return comments;
    },
  },

  Mutation: {
    createPost: authorization.permit('canCreatePosts')(
      async (
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
      }
    ),

    updatePost: authorization.permit('canEditPosts')(
      async (
        _: unknown,
        args: {
          id: Post['_id'];
          payload: Omit<Partial<Post>, '_id' | 'createdAt' | 'author'>;
        }
      ) => {
        let post = await Posts.findByIdAndUpdate(args.id, args.payload, {
          new: true,
        });

        if (post === null) {
          throw new Error('Post not found');
        }

        return post;
      }
    ),

    deletePost: authorization.permit('deletePosts')(
      async (_: unknown, args: { id: Post['_id'] }) => {
        const post = await Posts.findByIdAndDelete(args.id, { new: true });

        if (post === null) {
          throw new Error('Post not found');
        }

        return post;
      }
    ),
  },
};

export default postResolver;
