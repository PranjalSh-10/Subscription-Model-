import Stripe from 'stripe';
import { NextFunction, Request, Response } from 'express';
import Transaction, { ITransaction } from '../models/transaction';
import { JwtPayload } from 'jsonwebtoken';
import { config } from '../config/appConfig';
import { getEnvVariable } from '../utils';
import { CustomRequest } from '../middlewares/auth';
import { success } from '../utils/response';
import { CustomError } from '../middlewares/error';
import { subscribeAction } from './subscription';

const stripe = new Stripe('Your_SecretKey', {
  apiVersion: '2024-06-20'
});

export const createPaymentIntent = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
  const { amount } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency: 'inr',
    });

    const newTransact = new Transaction({
      userId: (req.id as JwtPayload).id,
      planId: req.body.planId,
      paymentIntentId: paymentIntent.id,
      amount: amount,
      status: 'initiated',
      // status: paymentIntent.status,
    })
    await newTransact.save();

    console.log('PaymentIntent created:');
    res.status(200).json(success(200, {
      clientSecret: paymentIntent.client_secret,
    }));
  } catch (error) {
    next(error);
  }
};


export const webhook = async (req: Request, res: Response, next: NextFunction) => {

  console.log('reached webhook')
  const sig = req.headers['stripe-signature'];
  if (!sig) {
    console.log('no sig error')
    return next({ status: 400, message: "webhook error: invalid signature" })
  }

  let event;

  try {
    const endpointSecret = getEnvVariable(config.WEBHOOK_SECRET);
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err: unknown) {
    return next(err);
  }


  let paymentIntent = event.data.object as Stripe.PaymentIntent;
  let status: string = '';
  let receipt = '';
  let paymentIntentId = paymentIntent.id;
  // console.log('pid: ', paymentIntent);

  const transact = await Transaction.findOne<ITransaction>({ paymentIntentId });
  if (transact?.status === 'succeeded') {
    return res.send();
  }

  switch (event.type) {
    case 'payment_intent.succeeded':
      // status = paymentIntent.status;
      if (!transact) {
        const err: CustomError = new Error("Transaction record not found");
        err.status = 404;
        return next(err);
      }
      await subscribeAction(transact.userId.toString(), transact.planId.toString(), paymentIntentId);
      console.log('in webhook', event.type);
      break;

    case 'payment_intent.payment_failed':
      console.log('in webhook', event.type);
      status = 'failed';
      console.log(`Failure reason: ${paymentIntent.last_payment_error?.message}`);
      break;

    case 'payment_intent.processing':
      console.log('in webhook', event.type);
      status = 'processing';
      break;

    case 'charge.succeeded':
      console.log('in webhook', event.type);
      let chargeIntent = event.data.object as Stripe.Charge
      // console.log('paymentintent in charge suc: ', paymentIntent)
      receipt = chargeIntent.receipt_url || '';
      // console.log('receipt: ', receipt);
      paymentIntentId = chargeIntent.payment_intent as string;
      break;

    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // console.log('payment intent in webhook: ', paymentIntent);

  if (status) {
    await Transaction.findOneAndUpdate({ paymentIntentId }, { status })
  }
  if (receipt) {
    await Transaction.findOneAndUpdate({ paymentIntentId }, { receipt })
  }

  res.send();
}