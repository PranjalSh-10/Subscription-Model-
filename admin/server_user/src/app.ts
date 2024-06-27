import express, { Request, Response, Express } from 'express';
import cors from "cors";
import User, { IUser } from './models/user';
import connectDB from './config/dbConfig';
import userRouter from './routes/user'
import adminRouter from './routes/admin'
import { ErrorMiddleware } from './middlewares/error';

// Create an Express application
const app:Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/admin", adminRouter);
app.use(ErrorMiddleware);

connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});
// app.use("/api", userRouter, subscriptionrouter);
export default app;