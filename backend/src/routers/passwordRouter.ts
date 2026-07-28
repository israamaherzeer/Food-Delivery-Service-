import express from "express"
import { forgetUserPasswordController, resetUserPasswordController, updateUserPasswordController } from "../Controllers/passwordController.js";
import { authenticate } from "../middleware/auth/authenticate.js";
import { AppError } from "../utils/errorHandler.js";
import { User } from "../models/User.js";
 import bcrypt from 'bcrypt';

const router = express.Router();
router.put("/admin-reset-password", async (req, res, next) => { 
    try { const { email, newPassword } = req.body; 
     if (!email || !newPassword) 
         return next(new AppError("Missing fields", 400, true));
         const user = await User.findOne({ email }); 
          if (!user) return next(new AppError("User not found", 404, true)); 
          user.password = await bcrypt.hash(newPassword, 10); 

          await user.save(); 
           res.json({ status: "success", message: "Password updated" }); 
         } catch (error) { 
             next(error);  } 
            
});

router.post("/forget-password", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { email } = req.body;
        if (!email) return next(new AppError("Some required fields are missing", 400, true));
        const data = await forgetUserPasswordController(email);
        res.status(200)
            .json({
                "status": "success",
                "message": "Verification code sent successfully",
                data: { verificationCode: data.code }
            })
    } catch (error) {
        next(error)
    }
})

/* PUT Reset User Password */
router.put("/reset-password", async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    try {
        const { email, verificationCode, newPassword } = req.body;
        if (!email || !verificationCode || !newPassword) return next(new AppError("Some required fields are missing", 400, true));
        const data = await resetUserPasswordController(email, verificationCode, newPassword);
        res.status(200)
            .json({
                "status": "success",
                "message": "The password reset successfully",
                data
            })
    } catch (error) {
        next(error)
    }
})

/* update User Password */
router.put("/password"
    , authenticate
    , async (req: express.Request, res: express.Response, next: express.NextFunction) => {
        try {
            const user = res.locals.user
            const { oldPassword, newPassword } = req.body;
            if (!oldPassword || !newPassword) return next(new AppError("Some required fields are missing", 400, true));
            const data = await updateUserPasswordController(user, oldPassword, newPassword);
            res.status(200)
                .json({
                    "status": "success",
                    "message": "The password reset successfully",
                    data
                })
        } catch (error) {
            next(error)
        }
    })

export default router;