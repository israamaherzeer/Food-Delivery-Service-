import mongoose from 'mongoose';
const orderSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
    },
    total_price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["Pending", "In Preparation","Searching for driver" ,"Out for Delivery", "Delivered"],
      default: "Pending",
    },
    driverStatus: {
      type: String,
      enum: ["Pending", "In Delivery", "Delivered"],
      default: "Pending",
    },
    payment_method: {
      type: String,
      enum: ["Cash", "CreditCard"],
      set: (v) => v.charAt(0).toUpperCase() + v.slice(1).toLowerCase(),
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Driver",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "OrderItem",
      },
    ],
    restaurant_rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    driver_rating: {
      type: Number,
      min: 1,
      max: 5,
    },
  },
  { timestamps: true }
);

export const Order = mongoose.model('Order', orderSchema);
