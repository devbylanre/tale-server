import mongoose from 'mongoose';

const mongooseConfig = async () => {
  return await mongoose
    .connect(process.env.MONGO_URI as string, { dbName: 'blogger' })
    .then(() => console.log('Connected to mongoDB'))
    .catch(() => console.log('Unable to connect to mongoDB'));
};

export default mongooseConfig;
