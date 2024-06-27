import { NextFunction, Request, Response } from 'express';
import Joi from 'joi';
import Subscription, { ISubscription } from '../models/transaction';
import Plan, { IPlan } from '../models/plan';
import User, { IUser } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';
import UserResource, { IUserResources } from '../models/userResources';
import { CustomError } from '../middleware/error';
import {success,error} from "../utils/response"


interface CustomRequest extends Request {
    id?: string | JwtPayload;
}

const addUserResource = async (userId: string, resource: number) => {
    try {
        await UserResource.findOneAndUpdate(
            { userId: userId },
            { $set: { leftResources: resource } },
            { upsert: true }
        )
    }
    catch (err) {
        throw err;
    }
}

export const subscribe = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const { planId } = req.body;
        const payloadData = req.id as JwtPayload;
        const userId = payloadData.id;

        const user = await User.findById<IUser>(userId);
        const plan = await Plan.findById<IPlan>(planId);

        if (!user) {
            return next({ status: 404, message: "User not found" });
        }

        if (!plan) {
            return next({ status: 404, message: "Plan not found" });
        }

        const prevTransact = await Subscription.findOne<ISubscription>({userId: userId}).sort({startDate:-1});
        if(plan.price!==0 || !prevTransact || prevTransact.endDate < new Date()){
            await addUserResource(userId, plan.resources);
        }
        else{
            return next({status: 409, message:"Already subscribed to another plan. Consider unsubscribing"})
        }


        const startDate = new Date();
        const endDate = new Date(startDate);


        endDate.setMonth(endDate.getMonth() + plan.duration);


        endDate.setDate(Math.min(startDate.getDate(), new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()));

        const newSubscription = new Subscription({
            userId: userId,
            planId: planId,
            startDate: startDate,
            endDate: endDate,
        });

        await newSubscription.save();

        return res.status(201).json(success(201, { message: 'Subscription purchased successfully' }));
    } catch (err) {
        next(err);
    }
};


export const unsubscribe = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const planName = req.body.planName;
        const leftResources = req.body.leftResources;
        const payloadData = <JwtPayload>req.id;

        const plan = await Plan.findOne<IPlan>({ name: planName });

        // if (!plan) {
        //     const err: CustomError = new Error("Your plan is not found");
        //     err.status = 404;
        //     throw err;
        // }

        if (plan?.price === 0) {
            return next({ status: 400, message: "Cannot unsubscribe to a free plan" });
        }

        const freePlan = await Plan.findOne<IPlan>({ price: 0 });

        if (!freePlan) {
            return next({ status: 500, message: "No free plan found" })
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + freePlan.duration);
        endDate.setDate(Math.min(startDate.getDate(), new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()));

        const unsub = new Subscription({
            userId: payloadData.id,
            planId: freePlan._id,
            startDate: startDate,
            endDate: endDate,
        })
        await unsub.save();


        if (leftResources > freePlan.resources || leftResources===-1) {
            await UserResource.updateOne<IUserResources>({ userId: payloadData.id }, { $set: { leftResources: freePlan.resources } });
        }

        return res.status(201).json(success(201, { message: 'Successfully unsubscribed' }));
    }
    catch (err) {
        next(err);
    }
}