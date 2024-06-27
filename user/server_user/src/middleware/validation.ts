import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middleware/error";
import Joi from "joi";

export const ValidationMiddleware = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next:NextFunction) => {
        const {error} = schema.validate(req.body);
        if(error){
            next({status: 400, message: error.details[0].message})
        }
        else{
            next();
        }
    }
}