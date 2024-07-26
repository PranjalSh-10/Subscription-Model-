import { Request, Response, NextFunction } from 'express';
import { generateAccessToken } from '../middlewares/auth';
import {success} from "../utils/response";
import { CustomError } from '../middlewares/error';

const adminEmail = 'admin@gmail.com';
const adminPassword = '123456789';

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (email !== adminEmail || password !== adminPassword) {
      const err: CustomError = new Error("Invalid email or password.");
      err.status = 400;
      return next(err);
    }

    const payload = { id:"abcdaabe730b545ee14dd06b", email:email };

    const accessToken = generateAccessToken(payload);
    return res.status(200).json(success(200,{message:"admin login successful", token: accessToken}));

    //res.status(200).json({ accessToken });
  } catch (err) {
    console.log(err);
    next(err);
  }
};
