import User, { IUser } from "../models/user";
import { NextFunction, Request, Response } from "express";
import { generateAccessToken } from "../middlewares/auth";
import { JwtPayload } from "jsonwebtoken";
import {success} from "../utils/response"
import { CustomError } from "../middlewares/error";
import {sendEmail} from "../mailer"

export const register = async (req: Request, res: Response, next: NextFunction):Promise<Response|void> => {
    try {        
        const data = req.body;

        const foundUser = await User.findOne<IUser>({email: data.email});
        if(foundUser){
            return next({status: 409, message: "User already registered"})
        }

        const newUser = new User(data);
        const userData: IUser = await newUser.save();

        // EMAIL NOTIFICATION

        const email=data.email;
        const name=data.name;

        await sendEmail({
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hi ${name}, thank you for registering with us.`
        });
        
        return res.status(201).json(success(201, {message: "Registration Successful"}));

    } 
    catch (err) {
        next(err)
    }
}

export const login = async (req: Request, res:Response, next:NextFunction):Promise<Response|void> => {
    try{
        const{email,password} = req.body;

        const user = await User.findOne<IUser>({ email });
        if (!user){
            const err:CustomError = new Error('User not registered');
            err.status = 401;
            return next(err);
        }
        if(!(await user.comparePassword(password))){
            const err:CustomError = new Error('Incorrect email or password');
            err.status = 400;
            return next(err);
        }

        const payload:JwtPayload={
            id: user.id.toString(),
            email: email,
        };

        const accessToken:string = generateAccessToken(payload);
        
        return res.status(200).json(success(200, { token: accessToken ,message:"Login Successful"}));
    } 
    catch (error) {
        next(error);
    }

}