import { VerificationCode } from "../models/VerificationCode.js";
import { AppError } from "./errorHandler.js";
import sendMail from "./sendMail.js";
import { createStyledEmail } from "./styleEmail.js";

export const sendVerificationCode = async (payload: any, title: string) => {
  try {
    if (!payload) {
      throw new AppError("Something went wrong with sending email verification", 500, true);
    }

    // Generate a 6-digit code
    const generatedCode = Math.floor(100000 + Math.random() * 900000).toString();
    const CODE_EXPIRATION_TIME = 60 * 60 * 1000; // 1 hour
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_TIME);

    // Try to find existing code
    let vCode = await VerificationCode.findOne({ user: payload._id });

    if (!vCode) {
      // If not found, create new
      vCode = new VerificationCode({
        verificationCode: generatedCode,
        user: payload._id,
        expiresAt,
      });
    } else {
      // Otherwise update
      vCode.verificationCode = generatedCode;
      vCode.expiresAt = expiresAt;
    }

    await vCode.save();

    // Send the OTP via email
    const emailMessage = createStyledEmail(payload, generatedCode);
    await sendMail(payload.email, title, emailMessage);

    const code = {
      id: vCode._id,
      verificationCode: vCode.verificationCode,
      expiresAt: vCode.expiresAt,
      createdAt: vCode.createdAt,
    };

    // Return the response excluding the password
    const userObject = payload.toObject ? payload.toObject() : payload;
    delete userObject.password;

    return {
      success: true,
      message: "Verification Code sent successfully",
      user: userObject,
      code,
    };
  } catch (error) {
    console.error("Error sending OTP verification:", error);
    throw new AppError("Error sending email verification", 500, true);
  }
};
