import express, { NextFunction } from 'express';
import { AppError } from '../../utils/errorHandler.js';
import { Category } from '../../models/Category.js';

export const validateCategory = async (req: express.Request, res: express.Response, next: NextFunction) => {
    const body = req.body;

    if (!body.name) {
        return next(new AppError("Category name is required", 400, true))
    }

    const existingCategory = await Category.findOne({ name: body.name });
    if (existingCategory) {
        return next(new AppError("The entered category name already exist in DB", 400, true));
    }

    next();
}