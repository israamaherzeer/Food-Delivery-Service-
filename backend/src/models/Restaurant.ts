import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  opening_time: {
    type: String, 
    required: true,
  },
  closing_time: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  menuItems: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
  }],
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }],
  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  }],
  imageUrl: {
    type: String,  
    required: false, 
  },
  deliveryPrice: {
    type: Number,
    default: 0       
  },
  backgroundImage: {
    type: String,  
    required: false, 
  },
  totalRating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
    set: v => Math.round(v * 100) / 100 
  },
  ratingCount: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

export const Restaurant = mongoose.model('Restaurant', restaurantSchema);
