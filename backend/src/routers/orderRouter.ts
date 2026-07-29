import express from 'express';
import { getOrdersByCustomerId, createOrder, getOrdersByRestaurantUserId } from '../Controllers/orderController.js';
import { authenticate } from '../middleware/auth/authenticate.js';
import { Request, Response, NextFunction } from "express";
import { Customer } from "../models/Customer.js";
import { Order } from '../models/Order.js';
import { Restaurant } from '../models/Restaurant.js';

import { getAvailableDrivers } from '../Controllers/driverController.js';
console.log("ORDER ROUTER LOADED");
const router = express.Router();
router.put("/:id/rating", async (req, res) => {
  try {
    const { type, rating } = req.body;

    if (!["restaurant", "driver"].includes(type)) {
       res.status(400).json({ message: "Invalid type" });
       return
    }

    if (rating < 1 || rating > 5) {
       res.status(400).json({ message: "Rating must be between 1 and 5" });
   return
      }

    const updateField =
      type === "restaurant"
        ? { restaurant_rating: rating }
        : { driver_rating: rating };

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateField,
      { new: true }
    ).populate("restaurant");

    if (!order) {
       res.status(404).json({ message: "Order not found" });
       return
    }

    if (type === "restaurant" && order.restaurant) {
  const restaurant = await Restaurant.findById(order.restaurant._id);
  if (restaurant) {
    const deliveredOrdersCount = await Order.countDocuments({
      restaurant: restaurant._id,
      status: "Delivered"
    });
    const effectiveCount = deliveredOrdersCount || 1;

    const newTotal =
      ((restaurant.totalRating || 0) * (effectiveCount - 1) + rating) / effectiveCount;

    restaurant.totalRating = Math.round(newTotal * 10) / 10;
    restaurant.ratingCount = effectiveCount; 

    const rest = await restaurant.save();
    console.log("rated rest ", rest);
  }
}


    res.json({ message: "Rating updated successfully", order });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";

    res.status(500).json({
      message: "Server error",
      error: message,
    });
  }
});


// router.put("/:id/rating", async (req, res) => {
//   try {
//     const { type, rating } = req.body;
//     if (!["restaurant", "driver"].includes(type)) {
//       return res.status(400).json({ message: "Invalid type" });
//     }
//     if (rating < 1 || rating > 5) {
//       return res.status(400).json({ message: "Rating must be between 1 and 5" });
//     }

//     const updateField = type === "restaurant" ? { restaurant_rating: rating } : { driver_rating: rating };
//     const order = await Order.findByIdAndUpdate(req.params.id, updateField, { new: true });

//     if (!order) {
//       return res.status(404).json({ message: "Order not found" });
//     }

//     res.json({ message: "Rating updated successfully", order });
//   } catch (err) {
//     res.status(500).json({ message: "Server error", error: err.message });
//   }
// });

router.post(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = res.locals.user._id;
      const { restaurantId, items, paymentMethod, address } = req.body;

      if (!restaurantId || !items || !paymentMethod || !address) {
        res.status(400).json({ status: "fail", message: "Missing required fields" });
        return;
      }

      const newOrder = await createOrder(userId, restaurantId, items, paymentMethod, address);

      res.status(201).json({
        status: "success",
        message: "Order created successfully",
        data: newOrder,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.get(
  "/",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = res.locals.user._id;
      const customer = await Customer.findOne({ user: userId });
      if (!customer) throw new Error("Customer not found");

      const customerId = customer._id.toString();
      const data = await getOrdersByCustomerId(customerId);

      res.status(200).json({
        status: "success",
        message: "Orders retrieved successfully",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.get("/restaurant-orders", authenticate, async (req, res, next) => {
  try {

    const restaurantUserId = res.locals.user._id;

    console.log("Restaurant user id:", restaurantUserId);

    let orders = await getOrdersByRestaurantUserId(restaurantUserId);

    res.status(200).json({
      status:"success",
      data:orders
    });

  } catch(error){
      console.log("GET RESTAURANT ORDERS ERROR:", error);
    res.status(500).json({
        message: error
    });
  }
});
router.put("/:id/preparation",authenticate,async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        res
          .status(404)
          .json({ status: "fail", message: "Order not found" });
         return;
      }

      if (order.status !== "Pending") {
        res
          .status(400)
          .json({ status: "fail", message: "Order is not in pending state" });
        return;
      }

      order.status = "In Preparation";
      await order.save();

      res.status(200).json({
        status: "success",
        message: "Order status updated to in preparation",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);
router.put("/:id/searchingForDriver",authenticate,async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const order = await Order.findById(id);

      if (!order) {
        res.status(404).json({ status: "fail", message: "Order not found" });
        return;
      }

      if (order.status !== "In Preparation") {
        res
          .status(400)
          .json({ status: "fail", message: "Order is not in pending state" });
        return;
      }

      order.status = "Searching for driver";
order.driver = null;
order.driverStatus = "Pending";

await order.save();

      res.status(200).json({
        status: "success",
     
        data: order,
      });
    } catch (error) {
      next(error);
    }
  }
);





export default router;
