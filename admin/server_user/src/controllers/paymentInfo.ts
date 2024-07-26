import { NextFunction, Request, Response } from 'express';
import User, { IUser } from '../models/user';
import Plan, { IPlan } from '../models/plan';
import Subscription, { ISubscription } from '../models/subscription';
import { success } from "../utils/response";
import Transaction, { ITransaction } from '../models/transaction';
import { CustomError } from '../middlewares/error';

export const getCurrentPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await Subscription.aggregate([
      { $sort: { startDate: -1 } },
      {
        $group: {
          _id: '$userId',
          subscriptionId: { $first: '$_id' },
          startDate: { $first: '$startDate' },
          planId: { $first: '$planId' },
        },
      },
    ]);

    console.log(subscriptions);

    const paymentHistory = await Promise.all(subscriptions.map(async (subscription) => {
      const user = await User.findById<IUser>(subscription._id);
      const plan = await Plan.findById<IPlan>(subscription.planId);
      return {
        id: subscription.subscriptionId,
        userName: user?.name,
        userEmail: user?.email,
        planName: plan?.name,
        startDate: subscription.startDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      };
    })
    );
    return res.status(200).json(success(200, { paymentHistory }));
  } catch (error) {
    console.error('Error fetching payment history:', error);
    next(error);
  }
};


export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 2;
    const skip = (page - 1) * limit;

    const keyword = req.query.keyword;
    const planName = req.query.planName as string;
    const status = req.query.status as string;
    const paymentMethod = req.query.paymentMethod as string;
    const isAsc = req.query.isAsc === "true";

    const conditions: any = {};

    if (keyword) {
      const users = await User.find({ name: { $regex: keyword, $options: 'i' } }, '_id').lean() as Array<IUser & { _id: string }>;
      const userIds = users.map(user => user._id);
      conditions.userId = { $in: userIds };
    }

    if(planName){
      const plan = await Plan.findOne<IPlan>({name: planName});
      if(plan){
        conditions.planId = plan._id;
      }
    }
    
    if(status){
      conditions.status = status;
    }
    
    if(paymentMethod){
      conditions.paymentMethod = paymentMethod
    }

    const sortOrder = isAsc ? 1 : -1;
    const records = await Transaction.find<ITransaction>(conditions).sort({ updatedAt: sortOrder }).skip(skip).limit(limit);

    // if (!records) {
    //   const err: CustomError = new Error("No transaction records found");
    //   err.status = 404;
    //   return next(err);
    // }

    const paymentHistory = await Promise.all(records.map(async (subscription) => {
      const user = await User.findById<IUser>(subscription.userId);
      const plan = await Plan.findById<IPlan>(subscription.planId);
      return {
        id: subscription._id,
        userName: user?.name,
        userEmail: user?.email,
        planName: plan?.name,
        amount: subscription.amount,
        date: subscription.updatedAt,
        paymentMethod: subscription.paymentMethod,
        status: subscription.status,
      };
    }))

    const totalCount = await Transaction.countDocuments(conditions);

    return res.status(200).json(success(200, { paymentHistory, pagination:{
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount/limit),
    } }));

  } catch (err) {
    next(err);
  }
}