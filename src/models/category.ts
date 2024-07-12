import { model, Schema, Types } from 'mongoose';

export type Category = {
  _id: Types.ObjectId;
  title: string;
  image: string;
  description: string;
};

const schema = new Schema<Category>({
  title: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const Categories = model<Category>('Categories', schema);

export default Categories;
