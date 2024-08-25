import { model, Schema, Types } from 'mongoose';

export type Role = {
  _id: Types.ObjectId;
  name: 'admin' | 'author' | 'reader' | 'owner' | 'developer';
  description: string;
  capabilities: Types.ObjectId[];
};

const schema = new Schema<Role>({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, required: true },
  capabilities: [{ type: String, ref: 'Capabilities' }],
});

const Roles = model<Role>('Roles', schema);

export default Roles;
