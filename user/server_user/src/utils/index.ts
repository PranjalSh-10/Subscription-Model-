import { config } from "../config/appConfig";
import { CustomError } from "../middleware/error";

export const getAcessTokenSecret = ():string => {
    if(!config.ACCESS_TOKEN_SECRET){
        const err:CustomError = new Error("Access Token Secret not set");
        err.status = 500;
        throw err;
        // throw new Error("Access Token Secret not set");
    }
    
    return config.ACCESS_TOKEN_SECRET;
}
