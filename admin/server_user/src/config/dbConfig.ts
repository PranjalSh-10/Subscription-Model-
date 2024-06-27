import mongoose from "mongoose";
import { config } from "./appConfig";

const connectDB = async () => {
    try{
        await mongoose.connect(config.CONN_STR, {dbName: config.DB_NAME});
        console.log("db connected");
    }
    catch(err){
        console.log(err);
    }
}

export default connectDB;