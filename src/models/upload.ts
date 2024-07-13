import { model, Schema, Types } from 'mongoose';

export type Upload = {
  _id: Types.ObjectId;
  name: string;
  path: string;
  size: number;
  uri: string;
  createdAt: Date;
};

const schema = new Schema<Upload>({
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  uri: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const Uploads = model<Upload>('Uploads', schema);
export default Uploads;
