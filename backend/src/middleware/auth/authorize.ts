import { RequestHandler } from "express";
import { AppError } from "../../utils/errorHandler.js";

export const authorize = (...allowedRoles: string[]): RequestHandler => {
    return (req, res, next) => {
        const user = res.locals.user;

        if (!user || !allowedRoles.includes(user.role)) {
            return next(new AppError("Forbidden: You don't have access to this resource", 403, true));
        }

        next();
    };
};
