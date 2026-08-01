import { Cart } from "../models/Cart.js";
import { CartItem } from "../models/CartItem.js";
import { Customer } from "../models/Customer.js";
import { MenuItem } from "../models/MenuItem.js";
import { AppError } from "../utils/errorHandler.js";

const getCart = async (customerId: string) => {
  const cart = await Cart.findOne({ customer: customerId })
    .populate({
      path: "items",
      populate: {
        path: 'menuItem',
        model: 'MenuItem'
      }
    })
    .populate("restaurant");

  if (!cart) {
    return {
      restaurant: null,
      items: []
    };
  }

  return cart;
};

const addItemToCart = async (
  customerId: string,
  menuItemId: string,
  quantity: number
) => {
  
  const menuItem = await MenuItem.findById(menuItemId).populate("restaurant");

  if (!menuItem) {
    throw new AppError("Menu item not found", 404, true);
  }

  let cart = await Cart.findOne({ customer: customerId });

  console.log("OLD CART:", cart);

  if (!cart) {
    cart = new Cart({
      customer: customerId,
      restaurant: menuItem.restaurant,
      items: []
    });

    await cart.save();

    console.log("NEW CART CREATED:", cart);
  } else {
    if (
      cart.restaurant &&
      cart.restaurant.toString() !== menuItem.restaurant._id.toString()
    ) {
      throw new AppError(
        "Cart can only contain items from one restaurant",
        400,
        true
      );
    }
  }


  const existingItem = await CartItem.findOne({
    cart: cart._id,
    menuItem: menuItemId
  });


  if (existingItem) {

   existingItem.quantity = quantity;
    await existingItem.save();

    // تأكد أن العنصر موجود داخل cart.items
    if (!cart.items.some(id => id.toString() === existingItem._id.toString())) {
        cart.items.push(existingItem._id);
        await cart.save();
    }

    console.log("UPDATED EXISTING ITEM:", existingItem);

} else {

    const newItem = new CartItem({
      cart: cart._id,
      menuItem: menuItemId,
      quantity
    });

    await newItem.save();

    console.log("NEW ITEM SAVED:", newItem);


    cart.items.push(newItem._id);

    console.log("AFTER PUSH:", cart.items);

  

    console.log("AFTER SAVE:", cart.items);
  }


  cart.restaurant = menuItem.restaurant;
  await cart.save();


  const updatedCart = await Cart.findById(cart._id)
    .populate({
      path: "items",
      populate: {
        path: "menuItem",
        model: "MenuItem"
      }
    })
    .populate("restaurant");


  console.log("FINAL CART:", updatedCart);


  return updatedCart;
};

const removeItemFromCart = async (customerId: string, cartItemId: string) => {
  const cart = await Cart.findOne({ customer: customerId });
  if (!cart) {
    throw new Error("Cart not found for customer");
  }
  console.log("cart item id: ", cartItemId);
  console.log("this is the cart from the backend", cart);
  const itemIndex = cart.items.findIndex(itemId => itemId.toString() === cartItemId);
  if (itemIndex === -1) {
    throw new Error("Item not found in cart");
  }

  await CartItem.findByIdAndDelete(cartItemId);

  cart.items.splice(itemIndex, 1);
  if (cart.items.length === 0) {
  cart.restaurant = null;
}
  await cart.save();

  return { message: "Item removed from cart" };
};
const updateCartItem = async (
  customerId: string,
  menuItemId: string,
  quantity: number
) => {

  const cart = await Cart.findOne({ customer: customerId });

  if (!cart) {
    throw new AppError("Cart not found",404,true);
  }


  const cartItem = await CartItem.findOne({
    cart: cart._id,
    menuItem: menuItemId
  });


  if (!cartItem) {
    throw new AppError("Cart item not found",404,true);
  }


  cartItem.quantity = quantity;

  await cartItem.save();


  return await Cart.findById(cart._id)
    .populate({
      path:"items",
      populate:{
        path:"menuItem",
        model:"MenuItem"
      }
    })
    .populate("restaurant");
};

export {
  getCart,
  addItemToCart,
  removeItemFromCart,
   updateCartItem
};
