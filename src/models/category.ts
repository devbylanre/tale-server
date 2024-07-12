import { model, Schema, Types } from 'mongoose';

export type CategoryType = {
  _id: Types.ObjectId;
  title: string;
  image: string;
  description: string;
};

const schema = new Schema<CategoryType>({
  title: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const Categories = model('Categories', schema);

export default Categories;
