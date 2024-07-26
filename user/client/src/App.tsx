import React from "react";
import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";
import HomePage from "./pages/Home";
import TestPage from "./pages/Test";
import PaymentHistoryPage from "./pages/PaymentHistory";
import CurrentPlanPage from "./pages/CurrentPlan";
import SubscriptionPage from "./pages/Subscription";
import ResourcePage from "./pages/Resource";
import PageNotFound from "./components/PageNotFound/PageNotFound";

function App() {
  const routers = createBrowserRouter([
    {
      path: "*",
      element: <PageNotFound/>,
    },
    {
      path: "/",
      element: <HomePage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <SignupPage />,
    },
    {
      path: "/payment-history",
      element: <PaymentHistoryPage />,
    },
    {
      path: "/current-plan-details",
      element: <CurrentPlanPage />,
    },
    {
      path: "/subscriptions",
      element: <SubscriptionPage />,
    },
    {
      path: "/resources",
      element: <ResourcePage />,
    },
    {
      path: "/protected",
      element: <TestPage />,
    },
  ]);

  return <RouterProvider router={routers} />;
}

export default App;
