import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({

  quantity: {
    type: Number,
    required: true,
  },
  price: {
    type: Number,   
    required: true,
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
  },
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true,
  },
}, { timestamps: true }); 

export const OrderItem = mongoose.model('OrderItem', orderItemSchema);
