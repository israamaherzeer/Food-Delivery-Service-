import express from 'express'
import { getRestaurantStatus, getRestaurantById, getRestaurantByName, getRestaurants, getRestaurantsByCategory } from '../Controllers/restaurantController.js';
import { authenticate } from "../middleware/auth/authenticate.js";
import { Restaurant } from "../models/Restaurant.js";
const router = express.Router();

router.get("/",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const data = await getRestaurants();

            res.status(200).json({
                "status": "success",
                "message": "Restaurants retrieved successfully",
                data
            })
        } catch (error) {
            next(error);
        }
    })


router.get("/category",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const categoryName = req.query.category as string;

            if (!categoryName) {
                res.status(400).json({
                    "status": "error",
                    "message": "Category name is required"
                })
            }

            const data = await getRestaurantsByCategory(categoryName);

            res.status(200).json({
                "status": "success",
                "message": "Restaurant filtered by category successfully",
                data
            })
        } catch (err) {
            next(err);
        }
    });


router.get("/id/:id",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const id: string = req.params.id;

            const data = await getRestaurantById(id);

            if (data === null) {
                res.status(404).json({
                    "status": "error",
                    "message": "Restaurant doesn't exist",
                    data
                })
            } else {
                res.status(200).json({
                    "status": "success",
                    "message": "Restaurant retrieved successfully",
                    data
                })
            }
        } catch (error) {
            next(error);
        }
    })

router.get("/name",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const name: string = req.query.name as string;
            console.log(name);
            
            const data = await getRestaurantByName(name);

            if (data === null) {
                res.status(404).json({
                    "status": "error",
                    "message": "Restaurant doesn't exist",
                    data
                })
            } else {
                res.status(200).json({
                    "status": "success",
                    "message": "Restaurant retrieved successfully",
                    data
                })
            }
        } catch (error) {
            next(error);
        }
    })



router.get("/status/:id",
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        console.log("STATUS ROUTE HIT:", req.params.id);
        try {
            const id: string = req.params.id;
            const status = await getRestaurantStatus(id);

            if (status === null) {
                res.status(404).json({
                    status: "error",
                    message: "Restaurant doesn't exist"
                });
            } else {
                res.status(200).json({
                    status: "success",
                    message: "Restaurant status retrieved successfully",
                    data: status
                });
            }
        } catch (error) {
            next(error);
        }
    }
);
router.put(
  "/profile",
  authenticate,
  async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ): Promise<void> => {
    try {

      const userId = res.locals.user._id;

      const updatedRestaurant =
        await Restaurant.findOneAndUpdate(
          { user: userId },
          {
            phone_number: req.body.phone_number,
            location: req.body.location,
            opening_time: req.body.opening_time,
            closing_time: req.body.closing_time,
            deliveryPrice: req.body.deliveryPrice,
          },
          { new: true }
        );


      if (!updatedRestaurant) {
        res.status(404).json({
          message: "Restaurant not found"
        });
        return;
      }


      res.status(200).json({
        status:"success",
        message:"Restaurant updated successfully",
        data:updatedRestaurant
      });


    } catch(error){
      next(error);
    }
  }
);


export default router; 
