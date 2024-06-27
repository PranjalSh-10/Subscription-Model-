import express, { Request, Response, Express } from 'express';
import cors from 'cors';
import connectDB from './config/dbConfig';
import authenticationRoute from './routes/authentication';
import paymentHistoryRoutes from './routes/paymentHistoryRoutes';
import resourceRoute from './routes/resources';
import planRoute from './routes/plans'
import subscriptionRoutes from './routes/subscription';
import { ErrorMiddleware } from './middleware/error';

// Create an Express application
const app: Express = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', authenticationRoute);
app.use('/api', paymentHistoryRoutes); // Include payment history routes
app.use('/api', resourceRoute);
app.use('/api', planRoute);
app.use('/api', subscriptionRoutes);
app.use(ErrorMiddleware);

connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});

import { authMiddleware } from './middleware/auth';
app.get('/protected', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello, from protected route');
});



export default app;
