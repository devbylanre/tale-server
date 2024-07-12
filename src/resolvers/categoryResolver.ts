import Categories, { Category } from '../models/category';

const categoryResolver = {
  Query: {
    categories: async () => {
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
  Mutation: {
    createCategory: async (
      _: unknown,
      args: { payload: Omit<Category, '_id'> }
    ) => {
      let category = await Categories.findOne({ title: args.payload.title });

      if (category !== null) {
        throw new Error('Category already exists');
      } else {
        category = new Categories(args.payload);
        category.save();
      }

      return category;
    },

    updateCategory: async (
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
    },

    deleteCategory: async (_: unknown, args: { id: Category['_id'] }) => {
      const category = await Categories.findByIdAndDelete(args.id, {
        new: true,
      });

      if (category === null) {
        throw new Error('Category not found');
      }

      return category;
    },
  },
};

export default categoryResolver;
