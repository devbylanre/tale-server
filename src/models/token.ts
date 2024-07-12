import mongoose, { Schema, Types } from 'mongoose';

export type TokenType = {
  code: number;
  expiresAt: Date;
  _id: Types.ObjectId;
  user: Types.ObjectId;
};

const schema = new Schema<TokenType>({
  code: { type: Number, required: true },
  expiresAt: { type: Date, required: true, default: Date.now() },
  user: { type: Schema.Types.ObjectId, required: true, ref: 'Users' },
});

const Tokens = mongoose.model('Tokens', schema);
export default Tokens;
