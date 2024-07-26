import mongoose,{Document} from "mongoose"

export interface IResource extends Document{
    title: string,
    description: string,
    url: string,
    blur_url: string,
}

const resourceSchema = new mongoose.Schema<IResource>({
    title: {
        type: String,
        required:true,
        trim: true,
        unique: true,
    },
    description: {
        type: String,
        trim: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
    },
    blur_url: {
        type: String,
        required: true,
        unique: true,
    }
})


const Resource = mongoose.model<IResource>('Resource', resourceSchema);

export default Resource;