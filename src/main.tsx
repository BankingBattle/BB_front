import React from 'react';
import ReactDOM from 'react-dom/client';

import Error from './routes/Error';
import {
  createBrowserRouter,
  LoaderFunction,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './i18n';
import './main.css';

import App, { loader as appLoader } from './routes/App';
import Home, { loader as homeLoader } from './routes/Home';
import Game, { loader as gameLoader } from './routes/Game';
import Round, { loader as roundLoader } from './routes/Round';

import Login, { action as loginAction } from './routes/Login';
import CreateGame, { action as createGameAction } from './routes/CreateGame';

import ManageRounds, {
  loader as createRoundLoader,
  action as createRoundAction,
} from './routes/ManageRounds';

import Profile, {
  loader as profileLoader,
  action as profileAction,
} from './routes/Profile';

import Register, {
  action as registerAction,
  loader as registerLoader,
} from './routes/Register';

export const queryClient = new QueryClient();

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
        errorElement: <Error />,
        loader: homeLoader,
      },
      {
        path: 'create',
        element: <CreateGame />,
        errorElement: <Error />,
        action: createGameAction,
      },
      {
        path: 'manage_rounds/:id',
        element: <ManageRounds />,
        errorElement: <Error />,
        loader: createRoundLoader as unknown as LoaderFunction,
        action: createRoundAction,
      },
      {
        path: 'login',
        element: <Login />,
        errorElement: <Error />,
        action: loginAction,
      },
      {
        path: 'register',
        element: <Register />,
        errorElement: <Error />,
        loader: registerLoader,
        action: registerAction,
      },
      {
        path: 'profile',
        element: <Profile />,
        errorElement: <Error />,
        loader: profileLoader,
        action: profileAction,
      },
      {
        path: 'game/:id',
        element: <Game />,
        errorElement: <Error />,
        loader: gameLoader as unknown as LoaderFunction,
      },
      {
        path: 'round/:id',
        element: <Round />,
        errorElement: <Error />,
        loader: roundLoader as unknown as LoaderFunction,
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
