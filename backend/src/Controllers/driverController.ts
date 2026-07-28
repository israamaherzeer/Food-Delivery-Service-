import { Driver } from "../models/Driver.js";
import { Order } from "../models/Order.js";
import mongoose from "mongoose";

export const getAvailableDrivers = async () => {
  const drivers = await Driver.find({ availability: true }).populate("user", "-password");
  
  if (!drivers || drivers.length === 0) {
    throw new Error("No available drivers found");
  }

  return drivers;
};

export const getDriverOrders = async (userId:string) => {

    const driver = await Driver.findOne({ user: userId });
const orders = await Order.find({
  $or: [
    {
      driver: null,
      status: "Searching for driver"
    },
    {
      driver: driver?._id
    }
  ]
})
.populate("restaurant")
.populate({
  path: "items",
  populate: {
    path: "menuItem",
    model: "MenuItem",
  },
})
.populate("customer")
.populate("driver");

    return orders;
};

export const updateDriverProfile = async (id:string, full_name:string, phone_number:string) => {
  const updatedDriver = await Driver.findOneAndUpdate(
    { user: id },
    { full_name, phone_number },
    { new: true, runValidators: true }
  );

  if (!updatedDriver) {
    throw new Error("Driver not found");
  }

  return updatedDriver;
};
