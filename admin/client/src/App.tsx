import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Create from "./pages/Create";
import Edit from "./pages/Edit";
import HomePage from "./pages/Home";
import SubscriptionPlans from "./pages/SubscriptionPlan";
import LoginPage from "./pages/Login";
import InfoPage from './pages/Transaction';
import CurrentPlanPage from './pages/CurrentPlan';
import PlanAnalytics from "./pages/PlanAnalytics";
import UserAnalytics from "./pages/UserAnalytic";



function App() {
  const routers = createBrowserRouter([
    // {
    //   path: "/",
    //   element: <HomePage />,
    // },
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/subscription-plans",
      element: <SubscriptionPlans />,
    },
    {
      path: "/current-plans",
      element: <CurrentPlanPage />,
    },
    { 
      path: '/PaymentInfo' ,
      element: <InfoPage/>
    },
    {
      path: "edit/:id",
      element: <Edit />,
    },
    {
      path: "create",
      element: <Create />,
    },
    {
      path: "/plan-analytics",
      element: <PlanAnalytics />,
    },
    {
      path: "/user-analytics",
      element: <UserAnalytics/>,
    },
  ]);
  return <RouterProvider router={routers} />;
}

export default App;
