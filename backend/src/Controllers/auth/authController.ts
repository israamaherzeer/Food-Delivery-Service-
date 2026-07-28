import { NSUser } from "../../../@types/user.js";
import { User } from "../../models/User.js";
import { AppError } from "../../utils/errorHandler.js";
import bcrypt from 'bcrypt';
import { generateUserToken } from "../../utils/generateToken.js";

const signupUserController = async (email: string, password: string, role: string) => {
  const hashPassword = await bcrypt.hash(password, 10)

  const user = new User({
    email: email,
    password: hashPassword,
    role,
  });
  const savedUser = await user.save();

  return savedUser
}

const loginController = async (payload: NSUser.IUser) => {
  const { email, password } = payload;

  console.log("Login attempt:", payload);

  const user = await User.findOne({ email });

  console.log("User found:", user);

  if (!user) {
    throw new AppError("User Not Found", 404, true);
  }

  const passwordMatching = await bcrypt.compare(password, user.password);

  if (!passwordMatching) {
    throw new AppError("Invalid credentials", 400, true);
  }

  const token = generateUserToken(user);

  const { password: userPassword, ...userWithoutPassword } = user.toObject();

  return {
    user: userWithoutPassword,
    type: user.role,
    token,
  };
};

export {
  loginController, 
  signupUserController
}