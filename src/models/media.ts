import { model, Schema, Types } from 'mongoose';

export type Media = {
  _id: Types.ObjectId;
  uri: string;
  name: string;
  hash: string;
  path: string;
  size: number;
  alt: string;
  user: Types.ObjectId;
  createdAt: Date;
};

const schema = new Schema<Media>({
  alt: { type: String, default: '' },
  uri: { type: String, required: true },
  name: { type: String, required: true },
  path: { type: String, required: true },
  size: { type: Number, required: true },
  hash: { type: String, required: true },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
  createdAt: { type: Date, required: true, default: Date.now() },
});

const Medias = model<Media>('Medias', schema);
export default Medias;
