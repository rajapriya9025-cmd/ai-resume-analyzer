import mongoose from 'mongoose';

/* Connects once at boot. If Mongo is not running we log it and keep
   going rather than exiting — the compare endpoint still works, it
   just stops recording what it did. */
export async function connectDb() {
  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mailroom';

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 3000 });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn(`MongoDB not connected (${error.message}). Analyses will not be saved.`);
  }
}

export function dbReady() {
  return mongoose.connection.readyState === 1;
}
