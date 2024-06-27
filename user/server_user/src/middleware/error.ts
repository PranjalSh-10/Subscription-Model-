import { Request, Response, NextFunction} from "express"

export interface CustomError extends Error {
    status?: number;
}

export const ErrorMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    const status = err.status || 500;
    const msg = err.message || "Internal Server Error";
    res.status(status).json({code: err.status, message: msg});
}
