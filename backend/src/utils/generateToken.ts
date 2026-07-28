import jwt from 'jsonwebtoken';
import { NSUser } from '../../@types/user.js';

interface TokenPayload {
    id: string;
    email: string;
    role: string;
}

const secretKey = process.env.SECRET_KEY || '';

const generateToken = (id: string, email: string, role: string) => {
    const payload: TokenPayload = { id, email, role };
    const options = { expiresIn: '1d' };
    //@ts-ignore
    return jwt.sign(payload, secretKey, options);
};

const generateUserToken = (user: NSUser.IUser) => {
    console.log("token :::::", generateToken(user._id, user.email, user.role));
    return generateToken(user._id, user.email, user.role);
};

export {
    generateUserToken
}