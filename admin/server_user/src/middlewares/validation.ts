import { Request, Response, NextFunction } from "express";
import { CustomError } from "../middlewares/error";
import Joi from "joi";

export const ValidationMiddleware = (schema: Joi.Schema) => {
    return (req: Request, res: Response, next:NextFunction) => {
        const {error} = schema.validate(req.body);
        if(error){
            const err:CustomError = new Error(error.details[0].message);
            err.status = 400;
            next(err);
        }
        else{
            next();
        }
    }
}