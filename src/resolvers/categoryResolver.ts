import authorize from '../middlewares/authorizeMiddleware';
import Categories, { Category } from '../models/category';
import Posts from '../models/post';

const categoryResolver = {
  Query: {
    categories: async (_: unknown, __: unknown) => {
      const categories = await Categories.find();

      if (categories.length === 0) {
        throw new Error('No categories found');
      }

      return categories;
    },
    category: async (_: unknown, args: { id: Category['_id'] }) => {
      const category = await Categories.findById(args.id);

      if (category === null) {
        throw new Error('Category not found');
      }

      return category;
    },
  },

  Category: {
    posts: async (parent: Category) => {
      const posts = await Posts.find({ category: parent._id })
        .populate('author')
        .populate('category');
      return posts;
    },
  },

  Mutation: {
    createCategory: authorize.roles(['admin', 'author', 'developer'])(
      async (_: unknown, args: { payload: Omit<Category, '_id'> }) => {
        const existingCategory = await Categories.findOne({
          title: args.payload.title,
        });

        if (existingCategory !== null) {
          throw new Error('Category already exists');
        }

        const category = new Categories(args.payload);
        category.save();

        return category;
      }
    ),

    updateCategory: authorize.roles(['admin', 'developer', 'author'])(
      async (
        _: unknown,
        args: { id: string; payload: Omit<Partial<Category>, '_id'> }
      ) => {
        const category = await Categories.findByIdAndUpdate(
          args.id,
          args.payload,
          { new: true }
        );

        if (category === null) {
          throw new Error('Category not found');
        }

        return category;
      }
    ),

    deleteCategory: authorize.roles(['admin', 'author', 'developer'])(
      async (_: unknown, args: { id: Category['_id'] }) => {
        const category = await Categories.findByIdAndDelete(args.id, {
          new: true,
        });

        if (category === null) {
          throw new Error('Category not found');
        }

        return category;
      }
    ),
  },
};

export default categoryResolver;
