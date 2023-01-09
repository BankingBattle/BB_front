import React from 'react';
import ReactDOM from 'react-dom/client';
import App, { loader as appLoader } from './routes/App';
import Home from './routes/Home';
import Login, { action as loginAction } from './routes/Login';
import Register, { action as registerAction } from './routes/Register';
import Profile, { loader as profileLoader } from './routes/Profile';
import TeamProfile from './routes/TeamProfile';
import Error from './routes/Error';
import {
  createRoutesFromElements,
  createBrowserRouter,
  Route,
  RouterProvider,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export const queryClient = new QueryClient();

import './i18n';
import './main.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route
      path="/"
      element={<App />}
      loader={appLoader}
      errorElement={<Error />}
    >
      <Route errorElement={<Error />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} action={loginAction} />
        <Route path="register" element={<Register />} action={registerAction} />
        <Route path="profile" element={<Profile />} loader={profileLoader} />
        <Route path="team" element={<TeamProfile />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
