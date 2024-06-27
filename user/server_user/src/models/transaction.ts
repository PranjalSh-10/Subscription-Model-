import mongoose, { Document, Schema } from 'mongoose';
import { IUser } from './user';
import { IPlan } from './plan';

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId | IUser;
    planId: mongoose.Types.ObjectId | IPlan;
    startDate: Date;
    endDate: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: Schema.Types.ObjectId, ref: 'Plan', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
}, { timestamps: true });

const Subscription = mongoose.model<ISubscription>('Transaction', subscriptionSchema);
export default Subscription;
