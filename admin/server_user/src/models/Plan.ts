import mongoose,{Document} from "mongoose";

export interface IPlan extends Document{
    name: string,
    features: string
    resources: number,
    price: number,
    duration: number,
}

const planSchema = new mongoose.Schema<IPlan>({
    name:{
        type:String,
        required: true,
        default:"free",
        unique: true,
    },
    resources: {
        type: Number,
       required: true,
    },
    price: {
        type: Number,
       required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    features: {
        type: String,
        // required: true,
    },
},{
    timestamps: true,
})

const Plan = mongoose.model<IPlan>('Plan', planSchema)

export default Plan;