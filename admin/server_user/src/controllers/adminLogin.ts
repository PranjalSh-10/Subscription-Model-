import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { generateAccessToken } from '../middlewares/admin';

const adminEmail = 'admin@gmail.com';
const adminPassword = '123456789';

export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (email !== adminEmail || password !== adminPassword) {
      // return res.status(400).json({ message: 'Invalid email or password.' });
      return next({status: 400, message: "Incorrect email or password"});
    }

    const payload = { id:"abcd", email:email };

    const accessToken = generateAccessToken(payload);

    res.status(200).json({ accessToken });
  } catch (err) {
    next(err);
  }
};
