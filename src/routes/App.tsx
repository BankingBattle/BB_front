import { Outlet, useLoaderData } from 'react-router-dom';
import { Header } from '../components/header';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { api, apiDefinition, query } from '../api';
import { isErrorFromPath } from '@zodios/core';
import { queryClient } from '../main';

interface IAuthContext {
  isAuth: boolean;
  nickname: string;
  setAuth: Dispatch<SetStateAction<boolean>>;
  setNickname: Dispatch<SetStateAction<string>>;
}

export const AuthCtx = createContext<IAuthContext | null>({} as IAuthContext);

export const loader = async () => {
  return queryClient
    .fetchQuery({
      queryFn: () => api.me({}),
      queryKey: query.getKeyByAlias('me', {}),
    })
    .catch(() => null);
};

function App() {
  const data = useLoaderData();

  return (
    <>
      <Header isLoggedIn={Boolean(data)} />
      <main className="py-10 container mx-auto flex flex-col">
        <Outlet />
      </main>
    </>
  );
}

export default App;
