import { User } from "../models/User.js";
import { VerificationCode } from "../models/VerificationCode.js";
import { AppError } from "../utils/errorHandler.js";
import { sendVerificationCode } from "../utils/sendVerificationCode.js";
import bcrypt from "bcrypt";

const forgetUserPasswordController = async (email: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User does not exist", 404, true);
    }
    const verificationResult = await sendVerificationCode(user, "Request to reset password");

    return verificationResult;
};

const resetUserPasswordController = async (email: string, verificationCode: string, newPassword: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError("User does not exist", 404, true);
    }

    const vCode = await VerificationCode.findOne({ verificationCode });

    if (!vCode || !vCode.user.equals(user._id)) {
        throw new AppError("Invalid Code", 400, true);
    }

    if (vCode.expiresAt < new Date()) {
        throw new AppError("Code has expired", 400, true);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    await VerificationCode.deleteOne({ _id: vCode._id });

    return { success: true, message: "Password updated successfully" };
};

const updateUserPasswordController = async (user: typeof User.prototype, oldPassword: string, newPassword: string) => {
    const passwordMatching = await bcrypt.compare(oldPassword, user.password);

    if (!passwordMatching) {
        throw new AppError("Invalid credentials", 400, true);
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return {
        success: true,
        message: "Password updated successfully",
    };
};

export {
    forgetUserPasswordController,
    resetUserPasswordController,
    updateUserPasswordController
};
