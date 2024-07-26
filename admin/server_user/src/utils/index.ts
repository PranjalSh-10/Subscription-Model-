import { CustomError } from "../middlewares/error";

export const getEnvVariable = (val: string|undefined):string => {
    if(!val){
        const err:CustomError = new Error("Environment variable not set");
        err.status = 500;
        throw err;
    }
    
    return val;
}
