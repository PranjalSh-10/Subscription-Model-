import { Request, Response, NextFunction } from 'express';
import UserResource, { IUserResources } from '../models/userResource';
import User, { IUser } from '../models/user';
import Subscription from '../models/subscription';
import Plan from '../models/plan';
import { success } from '../utils/response';
import ResourceGrp from '../models/resourceGrp';
import { CustomError } from '../middlewares/error';

export const getUserResourceDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 2;
        const skip = (page - 1) * limit;

        const keyword = req.query.keyword;
        const planName = req.query.planName as string;
        const updatedAt = req.query.updatedAt as string; 
        const isAsc = req.query.isAsc === "true";

        const conditions: any = {};

        if (keyword) {
            const users = await User.find({ name: { $regex: keyword, $options: 'i' } }, '_id').lean() as Array<IUser & { _id: string }>;
            const userIds = users.map(user => user._id);
            conditions.userId = { $in: userIds };
        }

        if (planName) {
            const plan = await Plan.findOne({ name: planName });
            if (plan) {
                const subscriptionIds = await Subscription.aggregate([
                    { $sort: { startDate: -1 } },
                    { $group: { _id: "$userId", mostRecentPlan: { $first: "$planId" } } },
                    { $match: { mostRecentPlan: plan._id } },
                    { $project: { userId: "$_id" } }
                ]);                
                const userIds = subscriptionIds.map(subscription => subscription.userId);
                conditions.userId = { $in: userIds };
            } else {
                return res.status(200).json(success(200, {
                    userDetails: [],
                    pagination: {
                        total: 0,
                        page: 0,
                        limit: 0,
                        totalPages: 1,
                    },
                }));
            }
        }

        if (updatedAt) {
            const dateFilter = new Date(updatedAt);
            if (!isNaN(dateFilter.getTime())) { 
                conditions.updatedAt = { $gte: dateFilter }; 
            }
        }

        const sortOrder = isAsc ? 1 : -1;
        const userResources = await UserResource.find(conditions, 'userId leftResources')
            .sort({updatedAt: sortOrder})
            .skip(skip)
            .limit(limit);

        if (!userResources.length) {
            const err: CustomError = new Error("No user found");
            err.status = 404;
            next(err);
        }

        const userDetails = await Promise.all(userResources.map(async (userResource) => {
            const userId = userResource.userId;
            const user = await User.findById(userId, 'name email');
            const subscription = await Subscription.findOne({ userId }).sort({ startDate: -1 }).select('planId');
            const planId = subscription ? subscription.planId : null;
            const plan = planId ? await Plan.findById(planId) : null;

            const leftResources = await UserResource.aggregate([
                { $match: { userId: userId } },
                { $unwind: '$leftResources' },
                {
                    $lookup: {
                        from: 'resources',
                        localField: 'leftResources.rId',
                        foreignField: '_id',
                        as: 'resourceDetails'
                    }
                },
                { $unwind: '$resourceDetails' },
                {
                    $project: {
                        title: '$resourceDetails.title',
                        access: '$leftResources.access'
                    }
                }
            ]);

            const totalResources = await ResourceGrp.aggregate([
                { $match: { _id: plan?.grpId } },
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

            const updatedDate = (await UserResource.findOne<IUserResources>({ userId }))?.updatedAt;

            return {
                userId: userId,
                userName: user?.name,
                userEmail: user?.email,
                totalResources,
                leftResources,
                planName: plan ? plan.name : 'No active plan',
                updatedDate: updatedDate?.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }),
            };
        }));

        const totalCount = await UserResource.countDocuments(conditions);

        return res.status(200).json(success(200, {
            userDetails,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit),
            },
        }));
    } catch (err) {
        next(err);
    }
};
