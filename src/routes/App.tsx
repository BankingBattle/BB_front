import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';

function App() {
  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
    </>
  );
}

export default App;
