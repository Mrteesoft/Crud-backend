import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/credpal_crud';

export async function connectToDatabase(): Promise<typeof mongoose> {
  mongoose.set('strictQuery', true);
  return mongoose.connect(MONGO_URI);
}


