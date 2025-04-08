import { config } from './../../config/index';
import mongoose from "mongoose";

export const connectDB = async () => {
    try {
      await mongoose.connect(config.mongoUri);
      console.log('✅ Connected to MongoDB');
    } catch (err) {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1); // optional: exit the app if DB fails
    }
  };