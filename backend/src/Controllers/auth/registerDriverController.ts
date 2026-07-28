import { NSUser } from "../../../@types/user.js"
import { Driver } from "../../models/Driver.js";
import { signupUserController } from "./authController.js";

const signupDriverController = async (payload: NSUser.IDriver) => {
    try {
        const user = await signupUserController(payload.email, payload.password, "driver")

        const driver = new Driver({
            user: user._id,
            full_name: payload.full_name,
            phone_number: payload.phone_number,
            availability: false,
        });

        await driver.save();

        return {
            user,
            driver,
        };
    } catch (error) {
        console.error(error);
        throw ("Something went wrong during driver signup");
    }
}

export {
    signupDriverController
}