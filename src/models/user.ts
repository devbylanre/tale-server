import mongoose, { Schema, Types } from 'mongoose';

export type UserType = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  role: 'author' | 'reader' | 'admin' | 'developer';
  status: 'deactivated' | 'activated' | 'pending';
};

const schema = new Schema<UserType>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastName: { type: String, required: true, lowercase: true },
  firstName: { type: String, required: true, lowercase: true },
  role: { type: String, required: true, lowercase: true, default: 'reader' },
  status: { type: String, required: true, lowercase: true, default: 'pending' },
});

const User = mongoose.model('User', schema);
export default User;
