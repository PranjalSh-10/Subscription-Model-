import mongoose, { Document } from "mongoose";
import { IUser } from "./user";
import { IPlan } from "./plan";

export interface ITransaction extends Document{
    userId: mongoose.Types.ObjectId | IUser,
    planId: mongoose.Types.ObjectId | IPlan,
    paymentIntentId: string,
    amount: number,
    paymentMethod: string,
    status: string,
    receipt: string,
}

const transactionSchema = new mongoose.Schema<ITransaction>({
    userId:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    planId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'Plan',
    },
    paymentIntentId: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentMethod:{
        type: String,
        default: 'card',
    },
    status:{
        type: String,
        required: true,
    },
    receipt: {
        type: String,
        default: '',
    }
},{
    timestamps: true,
})

const Transaction = mongoose.model<ITransaction>('Transaction', transactionSchema);

export default Transaction;