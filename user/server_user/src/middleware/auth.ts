import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getAcessTokenSecret } from "../utils";
import User, { IUser } from "../models/user";
import { CustomError } from "../middleware/error";

declare module "jsonwebtoken" {
    export interface JwtPayload {
        id: string;
    }
}

interface CustomRequest extends Request{
    id?: string | JwtPayload;
}


// authorization for accessing a website
export const authMiddleware = (req: CustomRequest, res:Response, next: NextFunction) => {
    
    try {
        // checking for access token in authorization Bearer
        const authHeader = req.headers['authorization'];
        const token = authHeader?.split(' ')[1];
        if(!token){
            return next({status:401, message: "Token not found: Unauthorised access"})
        }
        
        // checking validity of access token and adding payload (user info) to req
        const accessSecret = getAcessTokenSecret();
        const payloadData = <JwtPayload>jwt.verify(token, accessSecret);
        req.id = payloadData;
        console.log("payloadData: ", payloadData);
        next();
    } catch (err) {
        next(err);
    }
};


// Function to generate access token
export const generateAccessToken = (payload: JwtPayload): string => {
    try {
        const accessSecret = getAcessTokenSecret();
        return jwt.sign(payload, accessSecret, { expiresIn: '15d' });
    } catch (err) {
        console.error(err);
        throw err;
    }
};
