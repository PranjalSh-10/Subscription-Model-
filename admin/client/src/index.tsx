import React from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
// import { RouterProvider } from 'react-router-dom';
// import router from './routes';
import App from './App';
import toast, { Toaster } from 'react-hot-toast';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
  <Toaster/>
  <App/>
  </React.StrictMode>
);

reportWebVitals();
