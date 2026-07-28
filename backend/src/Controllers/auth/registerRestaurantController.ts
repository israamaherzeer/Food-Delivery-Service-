import { NSUser } from "../../../@types/user.js"
import { Restaurant } from "../../models/Restaurant.js";
import { SystemObject } from "../../../@types/systemObject.js";
import { signupUserController } from "./authController.js";

const signupRestaurantController = async (payload: NSUser.IRestaurant & { deliveryPrice?: number }, categories: SystemObject.ICategory[],image?: Express.Multer.File ) => {
    try {
       const user = await signupUserController(payload.email, payload.password, "restaurant")

        const restaurant = new Restaurant({
            user: user._id,
            phone_number: payload.phone_number,
            name: payload.name,
            location: payload.location,
            opening_time: payload.opening_time,
            closing_time: payload.closing_time,
            imageUrl: image?.filename,
           categories: categories?.map(cat => cat._id) || [],
            deliveryPrice: payload.deliveryPrice,

        });
        

        await restaurant.save();

        return {
            user,
            restaurant,
        };
    } catch (error) {
        console.error(error);
       throw new Error("Something went wrong during restaurant signup");
    }
}

export {
    signupRestaurantController
}