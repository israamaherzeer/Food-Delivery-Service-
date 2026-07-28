import { NSUser } from "../../../@types/user.js"
import { Cart } from "../../models/Cart.js";
import { Customer } from "../../models/Customer.js";
import { signupUserController } from "./authController.js";


const signupCustomerController = async (payload: NSUser.ICustomer) => {
  try {

    // 1. Create User
    const user = await signupUserController(
      payload.email,
      payload.password,
      "customer"
    );


    // 2. Create Customer first
    const customer = new Customer({
      user: user._id,
      full_name: payload.full_name,
      phone_number: payload.phone_number,
    });

    await customer.save();


    // 3. Create Cart with customer id
    const cart = new Cart({
      customer: customer._id,
      items: []
    });

    await cart.save();


    // 4. Link cart to customer
    customer.cart = cart._id;
    await customer.save();


    return {
      user,
      customer,
    };

  } 
  catch (error) {
  console.error("CUSTOMER SIGNUP ERROR:", error);
  throw error;
}
}


export {
  signupCustomerController
}