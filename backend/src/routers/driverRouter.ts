import express from "express";
import { getAvailableDrivers, updateDriverProfile } from "../Controllers/driverController.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { getDriverOrders } from "../Controllers/driverController.js";
import { Order } from "../models/Order.js";
import { Driver } from "../models/Driver.js";

const router = express.Router();

router.get("/drivers/available", async (req, res, next) => {
  try {
    const drivers = await getAvailableDrivers();

    res.status(200).json({
      status: "success",
      data: drivers,
    });
  } catch (error) {
    next(error);
  }
});

router.get("/orders", authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user._id;

    const orders = await getDriverOrders(userId);
    console.log(userId);
    res.status(200).json({
      status: "success",
      data: orders,
    });
  } catch (error) {
    next(error);
  }
});
router.put(
  "/orders/:id/startDelivery",
  authenticate,
  async (req, res, next) => {
    try {

      const driver = await Driver.findOne({
        user: res.locals.user._id
      });

      if (!driver) {
        return res.status(404).json({
          message: "Driver not found"
        });
      }

      // إذا السائق لديه طلب جارٍ
      if (!driver.availability) {
        return res.status(400).json({
          message: "Driver already has an active order"
        });
      }

      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({
          message: "Order not found"
        });
      }

      // إذا تم قبول الطلب من سائق آخر
      if (order.driver) {
        return res.status(400).json({
          message: "This order has already been accepted"
        });
      }

      order.driver = driver._id;
      order.status = "Out for Delivery";
      order.driverStatus = "In Delivery";

      driver.availability = false;

      await order.save();
      await driver.save();

      res.status(200).json({
        status: "success",
        data: order
      });

    } catch (error) {
      next(error);
    }
  }
);
router.put("/orders/:id/delivered", authenticate, async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res
        .status(404)
        .json({ status: "fail", message: "Order not found" });
      return;
    }

    order.status = "Delivered";
    order.driverStatus = "Delivered";
    await order.save();
      const driver = await Driver.findOneAndUpdate(
        { _id: order.driver },
        { availability: true },
        { new: true }
      );
      if (!driver) {
        res.status(404).json({ status: "fail", message: "Driver not found" });
      }

    res.status(200).json({ status: "success", data: order, driverAvailability: driver ? (driver.availability ? "Available" : "Not Available") : "Driver not found", });
  } catch (error) {
    next(error);
  }
});
router.get("/availability", authenticate, async (req, res, next) => {
  try {
    
    const driver = await Driver.findOne({ user: res.locals.user._id }).select(
      "availability"
    );

    if (!driver) {
       res.status(404).json({ message: "Driver not found" });
       return;
    }

    res.json({
      status: "success",
      availability: driver.availability ? "Available" : "Not Available",
    });
  } catch (error) {
    next(error);
  }
});

router.put("/availability", authenticate, async (req, res, next) => {
  try {
    const { status } = req.body;

   
    const driver = await Driver.findOneAndUpdate(
      { user: res.locals.user._id }, 
      { availability: status === "Available" },
      { new: true } 
    );

    if (!driver) {
       res.status(404).json({ message: "Driver not found" });
    }

    res.json({ message: "Availability updated", status });
  } catch (error) {
    next(error);
  }
});

router.put("/profile", authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const { full_name, phone_number } = req.body;

    const updatedDriver = await updateDriverProfile(
      userId,
      full_name,
      phone_number
    );

    res.status(200).json({
      status: "success",
      message: "Driver profile updated successfully",
      data: updatedDriver,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
});





export default router;
