import { NextFunction, Request, Response } from "express";
import Plan, { IPlan } from "../models/plan";
import { CustomError } from "../middleware/error";
import Subscription, { ISubscription } from "../models/transaction";
import { JwtPayload } from "jsonwebtoken";
import UserResource, { IUserResources } from "../models/userResources";
import { allPlans } from "../data/plans";
import {success,error} from "../utils/response"

interface CustomRequest extends Request {
  id?: string | JwtPayload;
}

export const getPlans = async (req: Request, res: Response, next: NextFunction):Promise<Response|void> => {
  try {
    // await Plan.insertMany(allPlans);
    const plans = await Plan.find();
    if (plans.length == 0) {
      return next({status: 500, message: "No subscription plans found"})
    }
    return res.status(200).json(success(200, {plans}));
    // res.status(200).json(plans);
  }
  catch (error) {
    next(error);
  }
};

// Fetch current plan for a user
export const getCurrentPlan = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response|void> => {
  try {
    console.log("hi", req.id);
    const userId = (req.id as JwtPayload).id as string;
    console.log(userId);
    const subscription = await Subscription.findOne({ userId }).sort({startDate:-1});

    if (!subscription) {
      return next({status: 404, message: 'Subscribe to a plan'})
    }

    const planId = subscription.planId as unknown as string;;
    const currentPlan = await Plan.findById(planId) as IPlan;
    const userResource = await UserResource.findOne<IUserResources>({userId: userId})

    const purchaseDate = new Date(subscription.startDate).toLocaleDateString();
    // Calculate remaining days
    const currentDate = new Date();
    const remainingDuration = Math.max(0, Math.ceil((subscription.endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)));

    const currentPlanDetails = {
      planName: currentPlan.name,
      duration: currentPlan.duration,
      purchaseDate: purchaseDate,
      remainingResources: userResource?.leftResources,
      remainingDuration
    };

    return res.status(200).json(success(200, {currentPlanDetails}));
  } 
  catch (error) {
    //console.error('Error fetching plan details:', error);
    next(error);    
  } 
};
