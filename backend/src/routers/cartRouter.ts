import express, { Request, Response, NextFunction } from 'express';
import {
  getCart,
  addItemToCart,
  removeItemFromCart,
   updateCartItem,
} from '../Controllers/cartController.js';
import mongoose from 'mongoose';

import {Cart} from '../models/Cart.js';
import {Customer} from '../models/Customer.js';

import { authenticate } from '../middleware/auth/authenticate.js';
import { authorize } from '../middleware/auth/authorize.js';


const router = express.Router();

router.get("/", authenticate, async (req:Request, res:Response, next:NextFunction) => {
  try {
    const user = res.locals.user; 
    console.log(user);
    if (user===undefined) {
    //   return res.status(401).json({ status: "error", message: "Unauthorized" });
    console.log("there is no userrrrrrrrrrrrrrrrrrrrrrrrrr!");
    }
    const customerId = user._id;

    const data = await getCart(customerId);

    res.status(200).json({
      status: "success",
      message: "Cart retrieved successfully",
      data
    });
  } catch (error) {
    console.log("here is the error", error)
    next(error);
  }
});


/////////// add


router.post("/add", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log("========== ADD CART REQUEST ==========");
console.log(req.body);
    const user = res.locals.user;
    const customerId = user._id;

    const { productId, quantity } = req.body;

    if (!productId || !quantity) {
    //   return res.status(400).json({ status: "error", message: "Missing productId or quantity" });
    }
    
    const addedCart = await addItemToCart(customerId, productId, quantity);

    res.status(201).json({
      status: "success",
      message: "Product added to cart",
      data: addedCart
    });
  } catch (error) {
    next(error);
  }
});

router.delete("/clear", authenticate,  
  async (req: Request, res: Response, next: NextFunction) => {
  try {
  const userId = res.locals.user._id;
  // if (!customer) throw new Error("Customer not found");
  
  const cart = await Cart.findOne({ customer: userId });
  if (cart) {
       await CartItem.deleteMany({
        cart: cart._id,
      });
    cart.items = [];
    cart.restaurant = null;
    await cart.save();
  }
  res.status(200).json({ message: "Cart cleared" });


} catch(error){
  next(error);
}
});

// deletee
router.delete("/:itemId", authenticate, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = res.locals.user;
    const itemId = req.params.itemId;

    const result = await removeItemFromCart(user._id, itemId);

    res.status(200).json({
      status: "success",
      message: result.message
    });
  } catch (error) {
    next(error);
  }
});
router.post(
  "/update",
  authenticate,
  async (req: Request, res: Response, next: NextFunction) => {
    try {

      const user = res.locals.user;

      const { productId, quantity } = req.body;

      const updatedCart = await updateCartItem(
        user._id,
        productId,
        quantity
      );

      res.status(200).json({
        status: "success",
        data: updatedCart
      });

    } catch (error) {
      next(error);
    }
  }
);

export default router;
