import { model, Schema, Types } from 'mongoose';

export type Upload = {
  _id: Types.ObjectId;
  name: string;
  path: string;
  size: number;
  uri: string;
  alt: string;
  user: Types.ObjectId;
  createdAt: Date;
};

const schema = new Schema<Upload>({
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uri: { type: String, required: true },
  alt: { type: String },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const Uploads = model<Upload>('Uploads', schema);
export default Uploads;
