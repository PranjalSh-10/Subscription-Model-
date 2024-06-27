import mongoose, {Document} from "mongoose";
import { IUser } from "./user";

export interface IUserResources extends Document{
    userId: mongoose.Types.ObjectId | IUser,
    leftResources: number,
}

const userResourceSchema = new mongoose.Schema<IUserResources>({
    userId: {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
    },
    leftResources: {
        type: Number,
        required: true,
    }
},
{
    timestamps: true,
})

const UserResource = mongoose.model<IUserResources>("UserResource", userResourceSchema);

export default UserResource;