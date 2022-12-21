import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';
import { createContext, Dispatch, SetStateAction, useEffect, useState } from 'react';

interface IAuthContext {
  isAuth: boolean
  nickname: string
  setAuth: Dispatch<SetStateAction<boolean>>
  setNickname: Dispatch<SetStateAction<string>>
}

export const AuthCtx = createContext<IAuthContext | null>({} as IAuthContext)

function App() {
  const [isAuth, setAuth] = useState(true);
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    // Do stuff connected with authorization check
  }, []);

  return (
    <AuthCtx.Provider value={{isAuth, nickname, setAuth, setNickname}}>
      <Header />
      <main className="py-10 container mx-auto flex flex-col">
        <Outlet />
      </main>
    </AuthCtx.Provider>
  );
}

export default App;
