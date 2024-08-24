import { model, Schema, Types } from 'mongoose';

export type Role = {
  _id: Types.ObjectId;
  name: 'admin' | 'author' | 'reader' | 'owner' | 'developer';
  capabilities: Types.ObjectId[];
};

const schema = new Schema<Role>({
  name: { type: String, required: true, unique: true },
  capabilities: [{ type: String, ref: 'Capabilities' }],
});

const Roles = model<Role>('Roles', schema);

export default Roles;
