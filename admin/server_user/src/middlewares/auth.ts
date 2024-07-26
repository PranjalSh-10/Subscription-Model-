import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getEnvVariable } from '../utils';
import { config } from '../config/appConfig';
import { CustomError } from './error';

interface CustomRequest extends Request {
  id?: string | JwtPayload; // Extend Request interface to hold JWT payload
}

export const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      const err: CustomError = new Error("Unauthorised Access");
      err.status = 401;
      return next(err);
    }

    const accessSecret = getEnvVariable(config.ACCESS_TOKEN_SECRET);
    const payloadData = jwt.verify(token, accessSecret) as JwtPayload;

    if(payloadData.email!=='admin@gmail.com'){
      const err: CustomError = new Error("Unauthorised Access");
      err.status = 401;
      return next(err);
    }

    req.id = payloadData;
    //console.log('payloadData: ', payloadData);

    next();
  } catch (err) {
    next(err);
  }
};

export const generateAccessToken = (payload: JwtPayload): string => {
    try {
        const accessSecret = getEnvVariable(config.ACCESS_TOKEN_SECRET);
        return jwt.sign(payload, accessSecret, { expiresIn: '15d' });
    } catch (err) {
        console.error(err);
        throw err;
    }
};


