import mongoose from 'mongoose';
import { NSUser } from '../../@types/user.js';

const userSchema = new mongoose.Schema<NSUser.IUser>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  role: {
    type: String,
    enum: ['customer', 'restaurant', 'driver'],
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const User = mongoose.model('User', userSchema);
