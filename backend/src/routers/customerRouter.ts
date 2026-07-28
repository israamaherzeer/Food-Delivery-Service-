import express from "express";
import { 
  updateCustomerProfile, 
  addAddress, 
  getAddresses, 
  deleteAddress,  
  updateAddress
} from "../Controllers/customerController.js";
import { authenticate } from '../middleware/auth/authenticate.js';

const router = express.Router();
router.put("/users/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const { full_name, phone_number } = req.body;

    const updatedUser = await updateCustomerProfile(id, full_name, phone_number);

    res.status(200).json({
      status: "success",
      message: "Customer profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
});

router.post("/address", authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const { address, label } = req.body;

    if (!address || typeof address !== "string" || address.trim() === "") {
      return res.status(400).json({ status: "fail", message: "Address is required" });
    }

    if (!label || typeof label !== "string" || label.trim() === "") {
      return res.status(400).json({ status: "fail", message: "Label is required" });
    }

    const addresses = await addAddress(userId, address, label);

    res.status(201).json({ 
      status: "success", 
      message: "Address added successfully", 
      data: addresses 
    });
  } catch (error) {
    next(error);
  }
});


router.get("/address", authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const addresses = await getAddresses(userId);

    res.status(200).json({ 
      status: "success", 
      data: addresses 
    });
  } catch (error) {
    next(error);
  }
});

router.put("/address/:id", authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const addressId = req.params.id;
    const { address } = req.body;

    if (!address || typeof address !== "string" || address.trim() === "") {
      res.status(400).json({ status: "fail", message: "Address is required" });
      return;
    }

    const updatedAddresses = await updateAddress(userId, addressId, address);

    res.status(200).json({
      status: "success",
      message: "Address updated",
      data: updatedAddresses,
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/address/:id", authenticate, async (req, res, next) => {
  try {
    const userId = res.locals.user._id;
    const addressId = req.params.id;

    const updatedAddresses = await deleteAddress(userId, addressId);

    res.status(200).json({
      status: "success",
      message: "Address deleted successfully",
      data: updatedAddresses,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
