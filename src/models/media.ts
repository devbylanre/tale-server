import { model, Schema, Types } from 'mongoose';

export type Media = {
  _id: Types.ObjectId;
  uri: string;
  name: string;
  size: number;
  alt: string;
  type: string;
  path: string;
  uploadedBy: Types.ObjectId;
  createdAt: Date;
};

const schema = new Schema<Media>({
  alt: { type: String, default: '' },
  uri: { type: String, required: true },
  name: { type: String, required: true },
  size: { type: Number, required: true },
  type: { type: String, required: true },
  path: { type: String, required: true },
  createdAt: { type: Date, required: true, default: Date.now() },
  uploadedBy: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
});

const Medias = model<Media>('Medias', schema);
export default Medias;
