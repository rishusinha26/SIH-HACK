import mongoose from 'mongoose';

export async function connectDatabase(mongoUri) {
  if (!mongoUri) {
    throw new Error('MONGO_URI is not defined');
  }
  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  return mongoose.connection;
}



