import express, { Request, Response, Express,NextFunction } from 'express';
import cors from 'cors';
import connectDB from './config/dbConfig';
import authenticationRoute from './routes/authentication';
import paymentHistoryRoutes from './routes/paymentHistory';
import resourceRoute from './routes/resource';
import planRoute from './routes/plan'
import subscriptionRoutes from './routes/subscription';
import { ErrorMiddleware } from './middlewares/error';
import stripeRoutes from './routes/stripe';

// Create an Express application
const app: Express = express();

app.use(cors());
app.use('/api/webhook', express.raw({type:'application/json'}))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', authenticationRoute);
app.use('/api', paymentHistoryRoutes); // Include payment history routes
app.use('/api', resourceRoute);
app.use('/api', planRoute);
app.use('/api', subscriptionRoutes);
app.use('/api', stripeRoutes);
app.use(ErrorMiddleware);

connectDB();

app.get('/', (req: Request, res: Response) => {
    res.send('Hello, TypeScript + Node.js + Express!');
});

import { authMiddleware } from './middlewares/auth';
app.get('/protected', authMiddleware, (req: Request, res: Response) => {
    res.send('Hello, from protected route');
});


import Resource from './models/resource';
import ResourceGrp, { IResourceGrp } from './models/resourceGrp';
import Plan, { IPlan } from './models/plan';
import mongoose from 'mongoose';
app.post('/add-random-resourceGrp', async (req: Request, res: Response) => {
    try {
        // Fetch three random resource IDs
        const resources = await Resource.aggregate([{ $sample: { size: 7 } }]);
        if (resources.length < 3) {
            return res.status(400).send('Not enough resources available');
        }

        // const resources = Resource.find();

        // Generate random access numbers and create the resources array
        const resourceAccessArray = resources.map(resource => ({
            rId: resource._id,
            access: Math.floor(Math.random() * 10) + 1 // Random access number between 1 and 100
        }));

        // Insert the new record into the ResourceGrp table
        const newResourceGrp = new ResourceGrp({ resources: resourceAccessArray });
        await newResourceGrp.save();

        res.status(201).send(newResourceGrp);
    } catch (error) {
        console.error('Error adding random resourceGrp:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/add-grp-to-starter', async (req: Request, res: Response) => {
    try {
        // Fetch the most recently created ResourceGrp
        const newResourceGrp = await ResourceGrp.findOne<IResourceGrp>().sort({ createdAt: -1 });
        if (!newResourceGrp) {
            return res.status(404).send('ResourceGrp not found');
        }

        // Find the Plan with the name "Starter"
        const plan = await Plan.findOne<IPlan>({ name: 'Pro' });
        if (!plan) {
            return res.status(404).send('Plan with name "Starter" not found');
        }

        // Update the Plan with the new ResourceGrp ID
        plan.grpId = newResourceGrp._id as mongoose.Types.ObjectId;
        await plan.save();

        res.status(200).send(plan);
    } catch (error) {
        console.error('Error updating plan with new ResourceGrp:', error);
        res.status(500).send('Internal Server Error');
    }
});

export default app;
