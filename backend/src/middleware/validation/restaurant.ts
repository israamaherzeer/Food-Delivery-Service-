import express, { NextFunction } from 'express';
import { User } from "../../models/User.js";
import { AppError } from '../../utils/errorHandler.js';
import { Category } from '../../models/Category.js';


export const validateRestaurant = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
) => {

    try {

        const body = req.body;


        if (!body.name || !body.location) {
            return next(
                new AppError("Some required fields are missing", 400, true)
            );
        }

const categories = Array.isArray(req.body.categories)
    ? req.body.categories
    : [req.body.categories];


const selectedCategories = await Category.find({
    _id: { $in: categories }
});


if (selectedCategories.length !== categories.length) {
    return next(
        new AppError("One or more selected categories are invalid.",400,true)
    );
}
      
        const existingUser = await User.findOne({
            email: body.email
        });


        if (existingUser) {
            return next(
                new AppError(
                    "The entered email already has an account",
                    400,
                    true
                )
            );
        }


        res.locals.selectedCategories = selectedCategories;


        next();


    } catch(error){

        next(error);

    }
};