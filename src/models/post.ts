import { model, Schema, Types } from 'mongoose';

export type Post = {
  _id: Types.ObjectId;
  title: string;
  content: any;
  image: string;
  excerpt: string;
  author: Types.ObjectId;
  category: Types.ObjectId;
  createdAt: Date;
};

const schema = new Schema<Post>({
  title: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  excerpt: { type: String, required: true },
  content: { type: Schema.Types.Mixed, required: true },
  author: { type: Schema.Types.ObjectId, ref: 'Users', required: true },
  category: { type: Schema.Types.ObjectId, ref: 'Categories', required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const Posts = model<Post>('Posts', schema);
export default Posts;
