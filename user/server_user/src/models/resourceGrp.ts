import mongoose, { Document, Schema, model } from "mongoose";
import { IResource } from "./resource";

export interface IResourceAccess {
    rId: mongoose.Types.ObjectId | IResource;
    access: number;
}

export interface IResourceGrp extends Document {
    resources: IResourceAccess[];
}

const resourceGrpSchema = new Schema<IResourceGrp>({
    resources: {
       type:[{
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
},{
    timestamps: true,
});

const ResourceGrp = model<IResourceGrp>('ResourceGrp', resourceGrpSchema);

export default ResourceGrp;
