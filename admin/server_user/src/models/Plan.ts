import mongoose, { Document } from "mongoose";
import { IResourceGrp } from "./resourceGrp";

export interface IPlan extends Document {
    name: string,
    features: string
    resources: number,
    price: number,
    duration: number,
    grpId: mongoose.Types.ObjectId | IResourceGrp,
}

const planSchema = new mongoose.Schema<IPlan>({
    name: {
        type: String,
        required: true,
        // default: "Free",
        unique: true,
        trim: true,
    },
    resources: {
        type: Number,
        required: true,
        trim: true,
    },
    price: {
        type: Number,
        required: true,
        trim: true,
    },
    duration: {
        type: Number,
        required: true,
        trim: true,
    },
    features: {
        type: String,
        // required: true,
    },
    grpId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'ResourceGrp',
    }
}, {
    timestamps: true,
})

const Plan = mongoose.model<IPlan>('Plan', planSchema)

export default Plan;