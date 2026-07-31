import express from "express"
import { validateUser } from "../middleware/validation/user.js";
import { signupCustomerController } from "../Controllers/auth/registerCustomerController.js";
import { signupDriverController } from "../Controllers/auth/registerDriverController.js";
import { AppError } from "../utils/errorHandler.js";
import { validateRestaurant } from "../middleware/validation/restaurant.js";
import { signupRestaurantController } from "../Controllers/auth/registerRestaurantController.js";
import { loginController } from "../Controllers/auth/authController.js";
import { Customer } from "../models/Customer.js";
import { Driver } from "../models/Driver.js";
import { Restaurant } from "../models/Restaurant.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { User } from "../models/User.js";
import { MenuItem } from "../models/MenuItem.js";
import { Category } from "../models/Category.js";
import { upload } from "../middleware/upload.js";
const router = express.Router();

router.post("/signup/customer",
    validateUser,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await signupCustomerController(req.body);
            res.status(201).json({
                "status": "success",
                "message": "Customer Sign up successfully",
                data
            })
        } catch (error) {
            next(error);
        }
    })

router.post("/signup/driver",
    validateUser,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await signupDriverController(req.body);
            res.status(201).json({
                "status": "success",
                "message": "Driver Sign up successfully",
                data
            })
        } catch (error) {
            next(error);
        }
    })

router.post(
    "/signup/restaurant",
    upload.single("image"),
    validateUser,
    validateRestaurant,

    async (req, res, next) => {

        try {

            console.log("REQ BODY:", req.body);
            console.log("REQ FILE:", req.file);

            const selectedCategories = res.locals.selectedCategories;

            console.log("CATEGORIES:", selectedCategories);


            const data = await signupRestaurantController(
                req.body,
                selectedCategories,
                req.file
            );


            res.status(201).json({
                status: "success",
                message: "Restaurant Sign up successfully",
                data
            });


        } catch (error) {

            console.log("SIGNUP ERROR:", error);

            next(error);
        }
    }
);
router.post("/login",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            if (req.body.email && req.body.password) {
                const data = await loginController(req.body);
                res.status(200)
                    .cookie(
                        "userToken", data.token,
                        { httpOnly: true, secure: true, sameSite: "none", path: "/"  })
                    .json({
                        "status": "success",
                        "message": "Login successfully",
                        data
                    })
            } else {
                return next(new AppError("Some required fields are missing", 400, true));
            }
        } catch (error) {
            next(error);
        }
    })

router.post("/logout",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            res.status(200)
                .clearCookie("userToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                    path: "/",
                })
                .json({ success: true, message: "User logged out successfully" });
        } catch (error) {
            next(error);
        }
    });

router.get("/profile", authenticate, async (req, res, next) => {
        const user = await User.findById(res.locals.user._id).select("-password");
        if (!user) {
        return next(new AppError("User not found", 404, true));}
        let userData = null;
    if (user.role === "restaurant") {
    const restaurant = await Restaurant.findOne({ user: user._id });
    if (!restaurant) {
        return next(new AppError("Restaurant not found", 404, true));
    }

        const menuItems = await MenuItem.find({ restaurant: restaurant._id });
      const categories = await Category.find({
        restaurants: restaurant._id,
      }).populate("restaurants");



    res.json({
      status: "success",
      message: "You are authorized",
      user: {
        ...restaurant.toObject(),
        menuItems,
        categories,
      },
    });

    } else if (user.role === "driver") {
    const driver = await Driver.findOne({ user: user._id });
    if (!driver) return next(new AppError("Driver not found", 404, true));

      res.json({
        status: "success",
        message: "You are authorized",
        user: driver,
      });

    } else if (user.role === "customer") {
      const customer = await Customer.findOne({ user: user._id });
      if (!customer) return next(new AppError("Customer not found", 404, true));

      res.json({
        status: "success",
        message: "You are authorized",
        user: customer,
      });
    }

    }
    )

export default router;

