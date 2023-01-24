import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { loader as appLoader } from './routes/App';
import Home from './routes/Home';
import Login, { action as loginAction } from './routes/Login';
import Register, { action as registerAction } from './routes/Register';
import Profile, { loader as profileLoader } from './routes/Profile';
import Game, { loader as gameLoader } from './routes/Game';
import Error from './routes/Error';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

import './i18n';
import './main.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: appLoader,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
        action: loginAction,
      },
      {
        path: 'register',
        element: <Register />,
        action: registerAction,
      },
      {
        path: 'profile',
        element: <Profile />,
        loader: profileLoader,
      },
      {
        path: 'game/:id',
        element: <Game />,
        // @ts-ignore
        loader: gameLoader,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
