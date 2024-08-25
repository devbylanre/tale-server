import mongoose, { Schema, Types } from 'mongoose';

export type User = {
  _id: Types.ObjectId;
  email: string;
  password: string;
  lastName: string;
  firstName: string;
  image: Types.ObjectId;
  role: Types.ObjectId;
  status: 'deactivated' | 'activated' | 'pending';
};

const schema = new Schema<User>({
  email: { type: String, required: true },
  password: { type: String, required: true },
  lastName: { type: String, lowercase: true },
  firstName: { type: String, lowercase: true },
  image: { type: Schema.Types.ObjectId, ref: 'Medias' },
  role: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'Roles',
    default: '66c9f4760c750ad22dce3ee7',
  },
  status: { type: String, required: true, lowercase: true, default: 'pending' },
});

const Users = mongoose.model<User>('Users', schema);
export default Users;
