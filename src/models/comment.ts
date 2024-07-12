import { model, Schema, Types } from 'mongoose';

export type Comment = {
  _id: Types.ObjectId;
  content: string;
  author: Types.ObjectId;
  post: Types.ObjectId;
  createdAt: Date;
};

const schema = new Schema<Comment>({
  content: { type: String, required: true },
  author: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  post: { type: Schema.Types.ObjectId, required: true, ref: 'Posts' },
  createdAt: { type: Date, default: Date.now },
});

const Comments = model<Comment>('Comments', schema);
export default Comments;
