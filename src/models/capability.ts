import { model, Schema, Types } from 'mongoose';

export type Capability = {
  _id: Types.ObjectId;
  name: string;
  label: string;
  description: string;
};

const schema = new Schema<Capability>({
  name: { type: String, required: true, unique: true, trim: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
});

const Capabilities = model<Capability>('Capabilities', schema);

export default Capabilities;
