import { NextFunction, Response } from 'express';
import Subscription, { ISubscription } from '../models/subscription';
import Plan, { IPlan } from '../models/plan';
import User, { IUser } from '../models/user';
import { JwtPayload } from 'jsonwebtoken';
import UserResource from '../models/userResource';
import { success } from "../utils/response"
import mongoose from 'mongoose';
import ResourceGrp, { IResourceGrp } from '../models/resourceGrp';
import { CustomRequest } from '../middlewares/auth';
import { CustomError } from '../middlewares/error';
import { sendEmail } from "../mailer"
import Transaction, { ITransaction } from '../models/transaction';
import Stripe from 'stripe';

const stripe = new Stripe('Your_SecretKey', {
    apiVersion: '2024-06-20'
  });

const addUserResource = async (userId: string, grpId: mongoose.Types.ObjectId | IResourceGrp) => {
    try {
        const grp = await ResourceGrp.findOne<IResourceGrp>({ _id: grpId })
        if (!grp) {
            const err: CustomError = new Error("Resource for the group not found");
            err.status = 404;
            throw err;
        }
        await UserResource.findOneAndUpdate(
            { userId: userId },
            { $set: { leftResources: grp.resources } },
            { upsert: true }
        )
    }
    catch (err) {
        throw err;
    }
}

export const subscribeAction = async (userId: string, planId: string, paymentIntentId: string) => {
    const user = await User.findById<IUser>(userId);
        const plan = await Plan.findById<IPlan>(planId);
        const transaction = await Transaction.findOne<ITransaction>({ paymentIntentId });

        if (!user) {
            const err: CustomError = new Error('User not found');
            err.status = 404;
            // return next(err);
            throw err;
        }
        if (!plan) {
            const err: CustomError = new Error('Plan not found');
            err.status = 404;
            // return next(err);
            throw err;
        }
        if (plan.price != 0 && !transaction) {
            const err: CustomError = new Error('Transaction record not found. Payment not successful');
            err.status = 400;
            // return next(err);
            throw err;
        }
        else if(transaction){
            if(await Subscription.findOne({transactionId: transaction._id})){
                const err: CustomError = new Error("Purchase already done");
                err.status = 400;
                // return next(err);
                throw err;
            }
            else if(transaction.status != 'succeeded'){
                const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
                if(paymentIntent.status!='succeeded'){
                    const err: CustomError = new Error("Payment not successful");
                    err.status = 400;
                    // return next(err);
                    throw err;
                }
                else{
                    transaction.status = 'succeeded';
                    // console.log('sub: ', paymentIntent)
                    await transaction.save();
                }
            }
        }

        const prevTransact = await Subscription.findOne<ISubscription>({ userId: userId }).sort({ startDate: -1 });

        if (plan.price !== 0 || !prevTransact || new Date(prevTransact.endDate) < new Date()) {
            await addUserResource(userId, plan.grpId);
        }
        else {
            const err: CustomError = new Error('Already subscribed to a plan.\nConsider unsubscribing');
            err.status = 409;
            // return next(err);
            throw err;
        }

        const startDate = new Date();
        const endDate = new Date(startDate);
        endDate.setTime(endDate.getTime() + ((plan.duration) * 30 * 24 * 60 * 60 * 1000));
        endDate.setDate(Math.min(endDate.getDate(), new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()));

        const newSubscription = new Subscription({
            userId: userId,
            planId: planId,
            transactionId: transaction?._id || null,
            startDate: startDate,
            endDate: endDate,
        });

        await newSubscription.save();

        const email = user.email;
        const name = user.name;
        const planName = plan.name;

        await sendEmail({
            to: email,
            subject: 'Plan Purchase Confirmation',
            text: `Hi ${name}, You have successfully purchased the ${planName} plan.`
        });
}

export const subscribe = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const planId: string = req.body.planId;
        const paymentIntentId:string = req.body.paymentIntentId || '';
        const payloadData = req.id as JwtPayload;
        const userId = payloadData.id;

        await subscribeAction(userId, planId, paymentIntentId);

        return res.status(201).json(success(201, { message: 'Subscription purchased successfully' }));
    } catch (err) {
        next(err);
    }
};


export const freePlanSubscribe = async (userId: string) => {
    const freePlan = await Plan.findOne<IPlan>({ price: 0 });

    if (!freePlan) {
        const err: CustomError = new Error('No free plan found');
        err.status = 404;
        // return next(err);
        throw err;
    }

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setTime(endDate.getTime() + ((freePlan.duration) * 30 * 24 * 60 * 60 * 1000));
    endDate.setDate(Math.min(endDate.getDate(), new Date(endDate.getFullYear(), endDate.getMonth() + 1, 0).getDate()));

    const sub = new Subscription({
        userId: userId,
        planId: freePlan._id,
        startDate: startDate,
        endDate: endDate,
    })
    await sub.save();

    addUserResource(userId, freePlan.grpId);
}

export const unsubscribe = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const planName = req.body.planName;
        const payloadData = <JwtPayload>req.id;
        const userId = payloadData.id;

        const user = await User.findById<IUser>(userId);


        const plan = await Plan.findOne<IPlan>({ name: planName });

        if (!plan) {
            const err: CustomError = new Error("Your plan is not found");
            err.status = 404;
            throw err;
        }

        if (plan.price === 0) {
            const err: CustomError = new Error('Cannot unsubscribe to a free plan');
            err.status = 400;
            return next(err);
        }

        await freePlanSubscribe(userId);

        if (user) {
            const email = user.email;
            const name = user.name;

            await sendEmail({
                to: email,
                subject: 'Plan unsubscribed successfully',
                text: `Hi ${name}, This is confirmation mail that you have unsubscribed the ${planName} plan.`
            });
        }


        return res.status(201).json(success(201, { message: 'Successfully unsubscribed' }));
    }
    catch (err) {
        next(err);
    }
}