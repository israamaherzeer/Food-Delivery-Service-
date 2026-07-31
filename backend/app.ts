import { Request, Response } from "express";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import cookieParser from 'cookie-parser'
import { initDB } from './src/config/db.js'; 
import authRouter from "./src/routers/authRouter.js"
import categoryRouter from "./src/routers/categoryRouter.js"
import passwordRouter from "./src/routers/passwordRouter.js"
import restaurantRouter from "./src/routers/restaurantRouter.js"
import customerRouter from "./src/routers/customerRouter.js";
import menuItemRouter from "./src/routers/menuRouter.js";
import orderRoutes from './src/routers/orderRouter.js';
import driverRouter from './src/routers/driverRouter.js';

import "./src/models/MenuItem.js"
import cors from 'cors';
import { customErrorHandler, DefaultErrorHandler } from "./src/middleware/errorHandler.js";
import { authenticate } from "./src/middleware/auth/authenticate.js";
import cartRoutes from './src/routers/cartRouter.js';
const app = express();

const PORT = Number(process.env.PORT) || 5000;

app.use(cors({
  origin: "https://food-delivery-service2.pages.dev",
  credentials: true,
}));
//

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// app.use(authenticate);

app.use("/users", authRouter)
app.use("/categories", categoryRouter)
app.use("/users", passwordRouter)
app.use("/restaurants", restaurantRouter)
app.use("/menu-items", menuItemRouter);
app.use("/customer-profile", customerRouter);
app.use('/api/orders', orderRoutes); 
app.use('/api/driver', driverRouter); 
app.use("/api/cart", cartRoutes);
app.use("/uploads", express.static("uploads"));
app.use(customErrorHandler);
app.use(DefaultErrorHandler);

app.get("/", (req: Request, res: Response) => {
  res.send('Server UP!');
});

app.listen(PORT, () => {
  console.log(`App is running and listening on port ${PORT}`);
  initDB();
});

export default app;
