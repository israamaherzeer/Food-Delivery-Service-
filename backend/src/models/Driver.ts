import mongoose from 'mongoose';

const driverSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, 
  },
  full_name: {
    type: String,
    required: true,
  },
  phone_number: {
    type: String,
    required: true,
  },
  availability: {
    type: Boolean,
    default: false,
  },
  //  vehicle_type: {
  //   type: String,
  //   required: true,
  //   enum: ['bike', 'car', 'scooter', 'other'], 
  // },
  // city: {
  //   type: String,
  //   required: true,
  // },
  orders: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  }]
}, { timestamps: true });

export const Driver = mongoose.model('Driver', driverSchema);
