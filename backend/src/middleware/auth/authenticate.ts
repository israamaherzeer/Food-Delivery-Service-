import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { AppError } from "../../utils/errorHandler.js";
import { User } from "../../models/User.js"; 
import { ExpressNS } from "../../../@types/index.js";

const authenticateUser = (): RequestHandler => {
  return async (req, res, next) => {
    console.log(req.cookies);
    const tokenHeader = req.headers["authorization"]?.split(" ")[1] || "";
    const tokenCookie = req.cookies?.userToken || tokenHeader;
    console.log("token", tokenCookie)

    if (!tokenCookie) {
      return next(new AppError("Unauthorized", 401, true));
    }

    try {
      const decoded = jwt.verify(tokenCookie, process.env.SECRET_KEY || "") as jwt.JwtPayload;

      if (!decoded?.email) {
        return next(new AppError("You are Unauthorized!", 401, true));
      }

      const user = await User.findOne({ email: decoded.email })

      if (!user) {
        return next(new AppError("User not found", 401, true));
      }

      (req as ExpressNS.RequestWithUser).user = user;
      res.locals.user = user;
      next();

    } catch (error) {
      return next(new AppError("Invalid token", 401, true));
    }
  };
};

const authenticate = authenticateUser();

export { authenticate };
