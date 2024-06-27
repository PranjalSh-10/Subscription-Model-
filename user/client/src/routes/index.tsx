import React from 'react';
import { createBrowserRouter } from 'react-router-dom'
import App from '../App';
import Home from '../pages/Home'
import LoginPage from '../pages/LoginPage';
import Subscription_Page from '../pages/Subscription_Page';
import SignupPage from '../pages/SignupPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
            {
                path : "",
                element : <Home/>
            },
            {
                path:'login',
                element:<LoginPage/>
              },
              {
                path:'signup',
                element:<SignupPage/>
              },
              {
                path:'subscriptions',
                element:<Subscription_Page/>
              },
    ],
  },
]);


export default router