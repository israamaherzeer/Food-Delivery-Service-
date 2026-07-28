import express from "express";
import { addMenuItem, deleteMenuItem, getMenuItems } from "../Controllers/menuController.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { MenuItem } from "../models/MenuItem.js";

const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    const data = await getMenuItems();
    res.status(200).json({
      status: "success",
      message: "Menu items retrieved successfully",
      data,
    });
  } catch (error) {
    next(error);
  }
});
router.delete("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    await deleteMenuItem(id);
    res.status(200).json({
      status: "success",
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    next(error);
  }
});


router.post("/", authenticate, async (req, res, next) => {
  try {
    const restaurantUserId = res.locals.user._id;
    const { name, description, price, image_url, type } = req.body;

    const newMenuItem = await addMenuItem(restaurantUserId, {
      name,
      description: description || undefined,
      price,
      image_url: image_url || undefined,
      type,
    });

    res.status(201).json({
      status: "success",
      message: "Menu item added successfully",
      data: newMenuItem,
    });
  } catch (error) {
    next(error);
  }
});
router.put("/:id", authenticate, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, price, image_url, type } = req.body;

    const updatedItem = await MenuItem.findByIdAndUpdate(
      id,
      {
        name,
        description: description || undefined,
        price,
        image_url: image_url || undefined,
        type,
      },
      { new: true }
    );

    if (!updatedItem) {
      res.status(404).json({ message: "Menu item not found" });
    }

    res.status(200).json({
      status: "success",
      message: "Menu item updated successfully",
      menuItem: updatedItem,
    });
  } catch (error) {
    next(error);
  }
});
export default router;

