import { NextFunction, Request, Response } from 'express';
import Plan, { IPlan } from '../models/plan';
import { success } from "../utils/response";
import ResourceGrp, { IResourceAccess, IResourceGrp } from '../models/resourceGrp';
import { CustomError } from '../middlewares/error';
import mongoose from 'mongoose';


export const createPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    console.log('res array: ', req.body.resourceArray);
    const resourceArray: IResourceAccess[] = req.body.resourceArray;
    const grpExist = await ResourceGrp.findOne<IResourceGrp>({ resources: resourceArray });
    const planExist = await Plan.countDocuments({grpId: grpExist?._id})
    let grpId: mongoose.Types.ObjectId;
    if (planExist) {
      const err: CustomError = new Error("Same resource plan already exists");
      err.status = 409;
      return next(err);
    }
    else if(grpExist){
      grpId = grpExist._id as mongoose.Types.ObjectId;
    }
    else {
      const newGrp = new ResourceGrp({ resources: resourceArray });
      await newGrp.save();
      grpId = newGrp._id as mongoose.Types.ObjectId;
    }

    const plan = new Plan({
      name: req.body.name,
      resources: req.body.resources,
      price: req.body.price,
      duration: req.body.duration,
      features: req.body.features,
      grpId
    });
    await plan.save();
    return res.status(200).json(success(200, { message: 'Plan added successfully', plan }));
  } catch (error) {
    next(error);
  }
};

export const updatePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = {
      name: req.body.name,
      features: req.body.features,
      price: req.body.price,
      duration: req.body.duration,
      resources: req.body.resources,
    }
    const plan = await Plan.findByIdAndUpdate(req.params.id, data, { new: true });
    if (!plan) {
      const err: CustomError = new Error("Plan not found");
      err.status = 404;
      return next(err);
    }
    await ResourceGrp.findByIdAndUpdate(plan.grpId, { resources: req.body.resourceArray })
    return res.status(200).json(success(200, { message: 'Plan updated successfully', plan }));
  } catch (error) {
    next(error);
  }
};

export const deletePlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plan = await Plan.findByIdAndDelete(req.params.id);
    if (!plan) {
      const err: CustomError = new Error("Plan not found");
      err.status = 404;
      return next(err);
    }
    return res.status(200).json(success(200, { message: 'Plan deleted successfully' }));
  } catch (error) {
    next(error);
  }
};

export const getPlan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const planDetails = await Plan.findById(req.params.id);
    if (!planDetails) {
      const err: CustomError = new Error("Plan not found");
      err.status = 404;
      return next(err);
    }
    const grpDetails = await ResourceGrp.findById(planDetails.grpId);
    const plan = {
      name: planDetails.name,
      resources: planDetails.resources,
      price: planDetails.price,
      features: planDetails.features,
      duration: planDetails.duration,
      resourceArray: grpDetails?.resources,
    }
    return res.status(200).json(success(200, { plan }));
  } catch (error) {
    next(error);
  }
};


export const getPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const plans = await Plan.find<IPlan>();
    console.log('get plans; ', plans)
    if (plans.length == 0) {
      const err: CustomError = new Error("No subscription plans found");
      err.status = 404;
      return next(err);
    }

    const planData = await Promise.all(plans.map(async (plan) => {
      const titles = await ResourceGrp.aggregate([
        { $match: { _id: plan.grpId } },
        { $unwind: '$resources' },
        {
          $lookup: {
            from: 'resources',
            localField: 'resources.rId',
            foreignField: '_id',
            as: 'resourceDetails'
          }
        },
        { $unwind: '$resourceDetails' },
        {
          $project: {
            title: '$resourceDetails.title',
            access: '$resources.access'
          }
        }
      ]);

      return {
        _id: plan._id,
        name: plan.name,
        price: plan.price,
        resources: plan.resources,
        features: plan.features,
        duration: plan.duration,
        titles
      }
    }))

    return res.status(200).json(success(200, { planData }));
  } catch (error) {
    next(error);
  }
};
