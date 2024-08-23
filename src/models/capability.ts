import { model, Schema } from 'mongoose';

type Capability = {
  name: string;
  label: string;
  description: string;
};

const schema = new Schema<Capability>({
  name: { type: String, required: true, unique: true },
  label: { type: String, required: true },
  description: { type: String, required: true },
});

const Capabilities = model<Capability>('Capabilities', schema);

export default Capabilities;
