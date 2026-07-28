import { Customer } from "../models/Customer.js";
import mongoose from "mongoose";

export const updateCustomerProfile = async (
  id: string,
  full_name: string,
  phone_number: string
) => {

  const cleanId = id.trim();
  const updatedUser = await Customer.findByIdAndUpdate(
    cleanId,
    { full_name, phone_number },
    { new: true }
  );

  if (!updatedUser) {
    throw new Error("User not found");
  }

  return updatedUser;
};

export const addAddress = async (userId: string, address: string, label: string) => {
  const customer = await Customer.findOne({ user: userId });
  if (!customer) throw new Error("Customer not found");

  const trimmedLabel = label.trim().toLowerCase();
  const labelExists = customer.addresses.some(
    (addr) => addr.label.trim().toLowerCase() === trimmedLabel
  );

  if (labelExists) {
    throw new Error("Label must be unique");
  }

  const newAddress = {
    _id: new mongoose.Types.ObjectId(),
    label: label.trim(),
    address: address.trim()
  };

  customer.addresses.push(newAddress);
  await customer.save();

  return customer.addresses;
};


export const getAddresses = async (userId: string) => {
  const customer = await Customer.findOne({ user: userId });
  if (!customer) throw new Error("Customer not found");

  return customer.addresses;
};


export const updateAddress = async (userId: string, addressId: string, newAddress: string) => {
  const user = await Customer.findOne({ user: userId });
  if (!user) throw new Error("User not found");

  const addressObj = user.addresses.id(addressId);
  if (!addressObj) throw new Error("Address not found");

  addressObj.address = newAddress;
  await user.save();
  return user.addresses;
};


export const deleteAddress = async (userId: string, addressId: string) => {
  const customer = await Customer.findOne({ user: userId });
  if (!customer) throw new Error("Customer not found");

  const index = customer.addresses.findIndex(
    (addr) => addr._id.toString() === addressId
  );

  if (index === -1) {
    throw new Error("Address not found");
  }

  customer.addresses.splice(index, 1); 
  await customer.save();

  return customer.addresses;
};
