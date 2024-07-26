import { NextFunction, Request, Response } from 'express';
import Plan, { IPlan } from '../models/plan';
import { success } from "../utils/response";
import ResourceGrp from '../models/resourceGrp';
import Resource, { IResource } from '../models/resource';
import { CustomError } from '../middlewares/error';

export const getResources = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const resources = await Resource.find<IResource>({}, 'title description url');
        if (!resources) {
            const err: CustomError = new Error("No resources found");
            err.status = 404;
            return next(err)
        }

        return res.status(200).json(success(200, { resources }))
    } catch (error) {
        next(error);
    }
}

export const getPlanResources = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const planId = req.params.id;
        const plan = await Plan.findById<IPlan>(planId);

        if (!plan) {
            const err: CustomError = new Error('Plan not found');
            err.status = 404;
            return next(err);
        }

        const resources = await ResourceGrp.aggregate([
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
                    url: '$resourceDetails.url',
                    access: '$resources.access',
                }
            }
        ]);

        res.status(200).json(success(200, { resources }))
    }
    catch (error) {
        next(error);
    }
}