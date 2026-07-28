import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  target_type: {
    type: String,
    enum: ['restaurant', 'driver'],
    required: true,
  },
  target_id: {
    type: mongoose.Schema.Types.ObjectId, // changed from number to ObjectId for referencing
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: true,
  },
}, { timestamps: true }); 

export const Review = mongoose.model('Review', reviewSchema);
