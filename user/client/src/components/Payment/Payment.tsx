import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import classes from './PaymentModal.module.css';
import { useSendData } from '../../helper/util';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface PaymentProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  planId: string;
  clientSecret: string;
}

const stripePromise = loadStripe('Your_StripePublishableKey');

const PaymentForm: React.FC<PaymentProps> = ({ isOpen, onClose, amount, planId, clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const sendData = useSendData();

  const subscribeHandler = async (planId: string, paymentIntentId: string) => {
    try {
      const resData = await sendData("POST", "subscribe", true, {
        planId: planId,
        paymentIntentId
      });

      navigate('/resources');
    } catch (error) {
      console.error('Error subscribing to plan:', error);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    if (!clientSecret) {
      toast.error('Client secret is missing');
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      console.error(error);
      // alert("Payment error: " + error.message);
      toast.error(error.message || 'Payment failed\nTry again')
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      onClose();
      // toast.success("Payment successful")
      // setTimeout(async ()=>{
        await subscribeHandler(planId, paymentIntent.id);
      // }, 2000)
    }
    // else {
    //   console.error('Payment failed');
    //   alert('Payment failed. Please try again.');
    // }
  };

  return (
    isOpen ? (
    <div className={classes.modalOverlay} onClick={onClose}>
        <div className={classes.modalContent} onClick={e => e.stopPropagation()}>
          <button className={classes.closeButton} onClick={onClose}>X</button>
          <h2>Payment</h2>
          <form onSubmit={handleSubmit}>
            <CardElement className={classes.CardElement} />
            <button type="submit" disabled={!stripe}>
              Pay Rs.{amount}
            </button>
          </form>
        </div>
      </div>
    ) : null
  );
};

const Payment: React.FC<PaymentProps> = (props) => (
  <Elements stripe={stripePromise} options={{ clientSecret: props.clientSecret }}>
    <PaymentForm {...props} />
  </Elements>
);

export default Payment;
