import { model, Schema, Types } from 'mongoose';

export type Category = {
  _id: Types.ObjectId;
  title: string;
  icon: string;
  description: string;
  children: Types.ObjectId[];
};

const schema = new Schema<Category>({
  icon: { type: String, required: true },
  title: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  children: [{ type: Schema.Types.ObjectId, ref: 'Categories' }],
});

const Categories = model<Category>('Categories', schema);

export default Categories;
