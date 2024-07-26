import mongoose,{Document} from "mongoose"
import { IResource } from "./resource";

export interface IResourceAnalytic extends Document{
    resourceId: mongoose.Types.ObjectId | IResource,
    usage: number,
}

const resourceAnalyticSchema = new mongoose.Schema<IResourceAnalytic>({
    resourceId: {
        type: mongoose.Types.ObjectId,
        ref: 'Resource',
        required:true,
    },
    usage: {
        type: Number,
        required: true,
        default: 0,
    },
},{
    timestamps: true,
})


const ResourceAnalytic = mongoose.model<IResourceAnalytic>('ResourceAnalytic', resourceAnalyticSchema);

export default ResourceAnalytic;