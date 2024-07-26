import express, { Request, Response, Express } from 'express';
import cors from "cors";
import connectDB from './config/dbConfig';
import adminRouter from './routes/managePlan';
import authenticationRouter from "./routes/authentication";
import analyticRouter from "./routes/analytic";
import resourceRouter from "./routes/resource";
import { ErrorMiddleware } from './middlewares/error';

const app:Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", authenticationRouter);
app.use("/admin", adminRouter);
app.use("/admin", analyticRouter);
app.use("/admin", resourceRouter)
app.use(ErrorMiddleware);

connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});

export default app;