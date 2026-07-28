import express, { NextFunction } from 'express';
import isEmail from 'validator/lib/isEmail.js';
import { User } from "../../models/User.js"
import { AppError } from '../../utils/errorHandler.js';


export const validateUser = async (
    req: express.Request,
    res: express.Response,
    next: NextFunction
) => {

    const body = req.body || {};

    if (!body.phone_number || !body.password || !body.email) {
        return next(new AppError("Some required fields are missing", 400, true));
    }

   if (!isEmail.default(body.email)) {
        return next(new AppError("The entered Email is not valid", 400, true))
    }

    const existingUser = await User.findOne({ email: body.email });

    if (existingUser) {
        return next(new AppError("Email already exists", 400, true));
    }

    if (body.password.length < 6) {
        return next(new AppError("Password must be at least 6 characters", 400, true));
    }

    next();
};
