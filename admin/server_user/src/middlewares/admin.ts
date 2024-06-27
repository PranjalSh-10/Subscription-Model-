import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { getAcessTokenSecret } from '../utils';

interface CustomRequest extends Request {
  id?: string | JwtPayload; // Extend Request interface to hold JWT payload
}

export const adminMiddleware = (req: CustomRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return next({ status: 401, message: 'Token not found: Unauthorized access' });
    }

    const accessSecret = getAcessTokenSecret();
    const payloadData = jwt.verify(token, accessSecret) as JwtPayload;

    if(payloadData.email!=='admin@gmail.com'){
      next({status:401, message: 'Unathorised access'})
    }

    req.id = payloadData;
    console.log('payloadData: ', payloadData);

    next();
  } catch (err) {
    next(err);
  }
};

export const generateAccessToken = (payload: JwtPayload): string => {
    try {
        const accessSecret = getAcessTokenSecret();
        return jwt.sign(payload, accessSecret, { expiresIn: '15d' });
    } catch (err) {
        console.error(err);
        throw err;
    }
};


