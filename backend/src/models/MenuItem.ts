import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  price: {
    type: Number,
    required: true,
    min: 0,
  },
  image_url: {
    type: String,
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  type: {
    type: String,
    enum: ['meals', 'appetizers','drinks'],
    required: true
  }
}, { timestamps: true });

export const MenuItem = mongoose.model('MenuItem', menuItemSchema);
