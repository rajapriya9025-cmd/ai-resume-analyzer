import mongoose from 'mongoose';

/* Connects once and reuses the connection. Called both at local boot
   and on every serverless invocation, so it has to be idempotent —
   calling mongoose.connect again while already connected would
   otherwise open a second pool on every request. */
export async function connectDb() {
  if (mongoose.connection.readyState === 1) return;

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mailroom';

  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      /* Serverless containers are torn down and reused unpredictably;
         a small pool suits that better than the default of 100. */
      maxPoolSize: 5
    });
    console.log('MongoDB connected');
  } catch (error) {
    console.warn(`MongoDB not connected (${error.message}). Analyses will not be saved.`);
  }
}

export function dbReady() {
  return mongoose.connection.readyState === 1;
}
