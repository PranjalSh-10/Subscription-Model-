import { Request, Response, NextFunction } from 'express';
import Subscription from '../models/subscription';
import Plan from '../models/plan';
import { success } from '../utils/response';
import moment from 'moment';

export const getPlanDetails = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
        const currentDate = moment().utc().startOf('day');
        const currentMonth = moment().utc().startOf('month');
        const plans = await Plan.find({}, 'name price');

        const planDetails = await Promise.all(plans.map(async plan => {
            const subscribedUsersCount = await Subscription.countDocuments({planId: plan._id});
            const dailyCount = await Subscription.countDocuments({
                planId: plan._id,
                startDate: {
                    $gte: currentDate.toDate(),
                    $lt: moment(currentDate).add(1, 'days').toDate(),
                }
            });
            const monthlyCount = await Subscription.countDocuments({
                planId: plan._id,
                startDate: {
                    $gte: currentMonth.toDate(),
                    $lt: moment(currentMonth).add(1, 'month').toDate(),
                }
            });

            return {
                _id: plan._id,
                name: plan.name,
                price: plan.price,
                subscribedUsersCount,
                dailyCount,
                monthlyCount,
                monthlyRevenue: monthlyCount*plan.price
            };
        }));

        return res.status(200).json(success(200, { planDetails }));
    } catch (err) {
        next(err);
    }
};
