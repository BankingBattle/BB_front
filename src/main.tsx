import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './routes/App';
import Home from './routes/Home';
import Login, { action as loginAction } from './routes/Login';
import Error from './routes/Error';
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from 'react-router-dom';

import './i18n';
import './main.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />} errorElement={<Error />}>
      <Route errorElement={<Error />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} action={loginAction} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
