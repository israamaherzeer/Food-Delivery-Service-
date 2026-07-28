import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

export const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL!);
    console.log("Connected to DB!");
  } catch (err) {
    console.error('Failed to connect to DB: ' + err);
  }
};
