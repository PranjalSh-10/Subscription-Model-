import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";
import Resource, { IResource } from "../models/resource";
import UserResource, { IUserResources } from "../models/userResource";
import {success} from "../utils/response"
import Plan from "../models/plan";
import Subscription from "../models/subscription";
import { CustomRequest } from "../middlewares/auth";
import { CustomError } from "../middlewares/error";
import mongoose from "mongoose";
import { IResourceAccess, IResourceGrp } from "../models/resourceGrp";
import ResourceAnalytic, { IResourceAnalytic } from "../models/resourceAnalytic";
import { freePlanSubscribe } from "./subscription";

interface resourceType{
    _id: mongoose.Types.ObjectId,
    title: string,
    description: string,
    blur_url: string,
}
interface grpType{
    rId: resourceType,
    access: number,
}

export const getResources = async (req: CustomRequest, res: Response, next: NextFunction):Promise<Response|void> => {
    try {
        // await Resource.insertMany(images);        
        // const resources = await Resource.find<IResource>({}, 'title description blur_url');
        const userId = (req.id as JwtPayload).id as string;
        const allResources = await Resource.find<IResource>({}, 'title description blur_url');
        const subscription = await Subscription.findOne({ userId }).sort({startDate:-1});
        if(!subscription){
            const err:CustomError = new Error('Subscribe to a plan');
            err.status = 400;
            return next(err);
        }
        if(subscription.endDate < new Date()){
            freePlanSubscribe(userId);
        }
        // const planId = subscription.planId;
        
        // const plan = await Plan.findById(planId).populate({
        //     path: 'grpId',
        //     populate: {
        //         path: 'resources.rId', 
        //         model: 'Resource' 
        //     }
        // });

        // if (!plan){
        //     const err:CustomError = new Error('Plan not found');
        //     err.status = 404;
        //     return next(err);
        // }
        const userResource = await UserResource.findOne({userId}).populate('leftResources.rId');

        if(!userResource){
            const err: CustomError = new Error("Resource record for user not found");
            err.status = 500;
            return next(err);
        }

        const resourcesAccessible = userResource.leftResources.map((resource:IResourceAccess) => ({
            _id: resource.rId._id,
            title: (resource.rId as IResource).title,
            description: (resource.rId as IResource).description,
            blur_url: (resource.rId as IResource).blur_url,
        }));

        const grpResourceIds = new Set(userResource.leftResources.map((resource: IResourceAccess) => (resource.rId._id as mongoose.Types.ObjectId).toString()));

        const resourcesInaccessible = allResources
            .filter((resource:IResource) => !grpResourceIds.has((resource._id as mongoose.Types.ObjectId).toString()))
            .map((resource:IResource) => ({
                _id: resource._id,
                title: resource.title,
                description: resource.description,
                blur_url: resource.blur_url,
            }));

        return res.status(200).json(success(200, {resourcesAccessible, resourcesInaccessible}));
    } 
    catch (err) {
        next(err);
    }

}

export const accessResource = async (req: CustomRequest, res: Response, next:NextFunction):Promise<Response|void> => {
    try {
        // console.log('payload for resource access: ', req.id);

        const userId = <JwtPayload>req.id;
        
        const foundUser = await UserResource.findOne<IUserResources>({userId: userId.id});
        // console.log("founduser in resources: ", foundUser)

        if(!foundUser){
            const err:CustomError = new Error('Transaction record not found');
            err.status = 404;
            return next(err);
        } 

        const resource = foundUser.leftResources.find(resource => resource.rId.equals(req.body.imageId));

        if(!resource){
            const err:CustomError = new Error('Subscribe to a higher tier');
            err.status = 400;
            return next(err);
        }
        
        if(resource.access === 0){
            const err:CustomError = new Error('Cannot access this resource anymore');
            err.status = 403;
            return next(err);
        }
        
        if(resource.access > 0){
            await UserResource.updateOne({userId: userId.id, "leftResources.rId": req.body.imageId}, {$inc: {"leftResources.$.access":-1}});
        }

        
        const image_details = await Resource.findOne<IResource>({_id:req.body.imageId});
        
        if(!image_details){
            const err:CustomError = new Error('Resource not found');
            err.status = 404;
            return next(err);
        }

        await ResourceAnalytic.findOneAndUpdate(
            { resourceId: image_details._id },
            { $inc: { usage: 1 } },
            { upsert: true }
        )
        
        return res.status(200).json(success(200,{url: image_details.url}));

    } 
    catch (err) {
        next(err);
    }
}