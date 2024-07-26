import { NextFunction, Request, Response } from 'express';
import { JwtPayload } from 'jsonwebtoken';
import Subscription, {ISubscription} from '../models/subscription';
import Plan, { IPlan } from '../models/plan';
import {success} from "../utils/response"
import { CustomRequest } from '../middlewares/auth';

export const getPaymentHistory = async (req: CustomRequest, res: Response, next:NextFunction) => {
  const userId = <JwtPayload>req.id;

  try {
    const paymentHistory = await Subscription.find<ISubscription>({ userId: userId.id });
  
    const response = [];
    for (const ele of (paymentHistory.reverse())){
      const plan = await Plan.findOne<IPlan>({_id: ele.planId});
      response.push({
        amount: plan?.price,
        name: plan?.name,
        date: new Date(ele.startDate).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      })
    }
    return res.status(200).json(success(200,{response}));
    
  } 
  catch (error) {
    next(error);
  }
};
