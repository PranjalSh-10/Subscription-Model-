import React, { useEffect, useState } from 'react';
import Header from './Header';
import classes from './Subscription.module.css';
import { useSendData } from '../../helper/util';
import { useNavigate } from 'react-router-dom';
import Payment from '../Payment/Payment'

const Subscriptions: React.FC = () => {
  const navigate = useNavigate();
  const [isModalOpen, setModalOpen] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({ amount: 0, planId: '', clientSecret: '' });
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const sendData = useSendData();
  const [filteredSubscriptions, setFilteredSubscriptions] = useState<any[]>([]);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const res = await sendData('GET', 'subscription-plans', false);
        const data = res.plans;
        console.log('Fetched subscriptions:', data);
        if (Array.isArray(data)) {
          setSubscriptions(data);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      }
    };

    fetchSubscriptions();
  }, []);


  const paymentHandler = async (planId: string) => {
    try {
      const selectedSubscription = subscriptions.find(sub => sub._id === planId);

      if (!selectedSubscription) {
        throw new Error('Selected subscription not found');
      }

      if (selectedSubscription.price === 0) {
        await subscribeHandler(planId);
        return;
      }

      const response = await sendData("POST", "create-payment-intent", true, {
        amount: selectedSubscription.price,
        planId
      });

      console.log('Payment Intent response:', response);

      if (!response || !response.clientSecret) {
        throw new Error('Client secret not received');
      }

      const { clientSecret } = response;

      setPaymentDetails({ amount: selectedSubscription.price, planId, clientSecret });
      setModalOpen(true);

    } catch (error) {
      console.error('Error subscribing to plan:', error);
    }
  };

  const subscribeHandler = async (planId: string) => {
    try {
      const resData = await sendData("POST", "subscribe", true, {
        planId: planId,
      });
      navigate('/resources');
    }
    catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (query: string) => {
    const filtered = subscriptions.filter(subscription =>
      subscription.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredSubscriptions(filtered);
  };

  return (
    <div className={classes.subscriptionsContainer}>
      <Header onSearch={handleSearch} />
      <h2 className={classes.subscriptionsHeader}>Available Subscriptions :</h2>
      <div className={classes.cards}>

        {filteredSubscriptions.length === 0 ? subscriptions.map((subscription) => (
          <div key={subscription._id} className={classes.card}>
            <div className={classes.cardHeader}>
              <h3>{subscription.name}</h3>
            </div>
            <div className={classes.cardBody}>
              <div className={classes.cardDetail}>
                <i className="fas fa-clock"></i>
                <span>{subscription.duration} months</span>
              </div>
              <div className={classes.cardDetail}>
                <i className="fas fa-database"></i>
                <span>
                  {subscription.resources === -1
                    ? "Unlimited Resource Access"
                    : `${subscription.resources} Resource Access`}
                </span>
              </div>
              {subscription.features &&
                <div className={classes.cardDetail}>
                  <i className="fas fa-list"></i>
                  <span>{subscription.features}</span>
                </div>
              }
              <p className={classes.cardPrice}>Rs. {subscription.price}</p>
            </div>
            <button className={classes.cardButton} onClick={() => paymentHandler(subscription._id)} >Subscribe now</button>
          </div>
        ))

          : filteredSubscriptions.map((subscription) => (
            <div key={subscription._id} className={classes.card}>
              <div className={classes.cardHeader}>
                <h3>{subscription.name}</h3>
              </div>
              <div className={classes.cardBody}>
                <div className={classes.cardDetail}>
                  <i className="fas fa-clock"></i>
                  <span>{subscription.duration} months</span>
                </div>
                <div className={classes.cardDetail}>
                  <i className="fas fa-database"></i>
                  <span>
                    {subscription.resources === -1
                      ? "Unlimited Resource Access"
                      : `${subscription.resources} Resource Access`}
                  </span>
                </div>
                {subscription.features &&
                <div className={classes.cardDetail}>
                  <i className="fas fa-list"></i>
                  <span>{subscription.features}</span>
                </div>
              }
                <p className={classes.cardPrice}>Rs. {subscription.price} </p>
              </div>
              <button className={classes.cardButton} onClick={() => paymentHandler(subscription._id)} >Subscribe now</button>
            </div>
          ))}
      </div>

      {isModalOpen && (
        <Payment
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          amount={paymentDetails.amount}
          planId={paymentDetails.planId}
          clientSecret={paymentDetails.clientSecret}
        />
      )}

    </div>
  );
};

export default Subscriptions;
