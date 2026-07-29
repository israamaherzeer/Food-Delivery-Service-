import { Order } from "../models/Order.js";
import { OrderItem } from "../models/OrderItem.js";
import { Customer } from "../models/Customer.js";
import { AppError } from "../utils/errorHandler.js";
import mongoose from "mongoose";
import { Types } from "mongoose";
import { Restaurant } from "../models/Restaurant.js";

interface OrderItemInput {
  menuItem: Types.ObjectId; 
  quantity: number;
  price: number;
}

type PaymentMethod = "Cash" | "CreditCard";

export const createOrder = async (
  userId: string,
  restaurantId: string,
  items: OrderItemInput[],
  paymentMethod: PaymentMethod,
  address: string
) => {
  const customer = await Customer.findOne({ user: userId });
  if (!customer) throw new AppError("Customer not found", 404, true);

  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError("Order must contain at least one item", 400, true);
  }

  let totalPrice = 0;

  const order = await Order.create({
    total_price: 0, 
    payment_method: paymentMethod,
    customer: customer._id,
    restaurant: restaurantId,
    items: [],
    address: address,
  });

  const orderItems = [];

  for (const item of items) {
    const { menuItem, quantity, price } = item;

    if (!menuItem || typeof quantity !== 'number' || typeof price !== 'number') {
      throw new AppError("Each item must include menuItem, quantity, and price", 400, true);
    }

    totalPrice += price * quantity;

    const orderItem = await OrderItem.create({
      quantity,
      price,
      menuItem,
      order: order._id,
    });

    orderItems.push(orderItem);
    
  }

  const restaurant = await Restaurant.findOne({ _id: restaurantId });
  if (restaurant && typeof restaurant.deliveryPrice === 'number') {
    totalPrice += restaurant.deliveryPrice;
  }

  order.total_price = totalPrice;
  order.items = orderItems.map((item) => item._id);

  await order.save();

  return order;
};

const getOrdersByCustomerId = async (customerId: string) => {
  const orders = await Order.find({ customer: customerId })
    .populate("restaurant", "name")
    .populate({
      path: "items",
      populate: { path: "menuItem", select: "name price" }
    })
    .populate("driver","full_name phone_number")
    .sort({ createdAt: -1 });
  // console.log("im the orders :::::: ",orders);
  return orders;
};

const getOrderById = async (orderId: string) => {
  if (!mongoose.Types.ObjectId.isValid(orderId)) {
    throw new AppError("Invalid order ID", 400, true);
  }

  const order = await Order.findById(orderId)
    .populate("restaurant")
    .populate("items.menuItem")
    .populate("driver");

  if (!order) {
    throw new AppError("Order not found", 404, true);
  }

  return order;
};

 const getOrdersByRestaurantUserId = async (userId: string) => {
  console.log("USER ID:", userId);

const restaurant = await Restaurant.findOne({ user: userId });

console.log("RESTAURANT:", restaurant);

  if (!restaurant) throw new Error("Restaurant not found");

  return await Order.find({ restaurant: restaurant._id })
    .populate("customer", "full_name phone_number")
    .populate({
      path: "items",
      populate: {
        path: "menuItem",
        select: "name price",
      },
    })
    .populate({
      path: "driver", 
      populate: {
        path: "user", 
        select: "full_name phone_number", 
      },
    }) 
    .populate("restaurant","deliveryPrice");
};


export { getOrdersByCustomerId, getOrderById, getOrdersByRestaurantUserId };
