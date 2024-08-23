import mongoose, { Schema, Types } from 'mongoose';
import { Role } from './role';

export type User = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  image: Types.ObjectId;
  role: Role['name'];
  status: 'deactivated' | 'activated' | 'pending';
};

const schema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastName: { type: String, lowercase: true },
  firstName: { type: String, lowercase: true },
  image: { type: Schema.Types.ObjectId, ref: 'Medias' },
  role: { type: String, required: true, default: 'reader', ref: 'Roles' },
  status: { type: String, required: true, lowercase: true, default: 'pending' },
});

const Users = mongoose.model<User>('Users', schema);
export default Users;
