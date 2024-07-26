import mongoose, { Document } from "mongoose";
import { IUser } from "./user";

interface IResourceAccess {
    rId: mongoose.Types.ObjectId;
    access: number;
}

export interface IUserResources extends Document {
    userId: mongoose.Types.ObjectId | IUser,
    leftResources: IResourceAccess[],
    createdAt: Date,
    updatedAt: Date,
}

const userResourceSchema = new mongoose.Schema<IUserResources>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    leftResources: {
        type: [{
            rId: {
                type: mongoose.Types.ObjectId,
                ref: 'Resource',
                required: true,
                index: true,
            },
            access: {
                type: Number,
                required: true,
            }
        }],
        required: true,
        unique: true,
    }
},
    {
        timestamps: true,
    }
)

const UserResource = mongoose.model<IUserResources>("UserResource", userResourceSchema);

export default UserResource;