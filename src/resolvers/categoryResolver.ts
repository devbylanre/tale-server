import Categories, { CategoryType } from '../models/category';

const categoryResolver = {
  Query: {
    categories: async () => {
      const categories = await Categories.find();

      if (categories.length === 0) {
        throw new Error('No categories found');
      }

      return categories;
    },
    category: async (_: unknown, args: { id: CategoryType['_id'] }) => {
      const category = await Categories.findById(args.id);

      if (category === null) {
        throw new Error('Category not found');
      }

      return category;
    },
  },
  Mutation: {
    createCategory: async (_: unknown, args: CategoryType) => {
      let category = await Categories.findOne({ title: args.title });

      if (category !== null) {
        category = await Categories.findByIdAndUpdate(category._id, args, {
          new: true,
        });
      } else {
        category = new Categories(args);
        category.save();
      }

      if (category === null) {
        throw new Error('Error creating category');
      }

      return category;
    },

    updateCategory: async (
      _: unknown,
      args: { id: string; payload: Omit<Partial<CategoryType>, '_id'> }
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

    deleteCategory: async (_: unknown, args: { id: CategoryType['_id'] }) => {
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
