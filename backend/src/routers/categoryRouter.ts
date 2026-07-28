import express from "express"
import { createCategoryController } from "../Controllers/categoryController.js";
import { validateCategory } from "../middleware/validation/category.js";
import { Category } from "../models/Category.js";

const router = express.Router();

router.post("/",
    validateCategory,
    async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const name: string = req.body.name as string;

            const data = await createCategoryController(name);

            res.status(201).json({
                "status": "success",
                "message": "Category Created successfully",
                data
            })
        } catch (error) {
            next(error);
        }
    })

    router.get(
    "/",
    async (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) => {

        try {

            const categories = await Category.find();

            res.status(200).json({
                status: "success",
                data: categories
            });

        } catch(error) {
            next(error);
        }

    }
);
export default router