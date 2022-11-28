import { Outlet } from 'react-router-dom';
import { Header } from '../components/header';

function App() {
  return (
    <>
      <Header />
      <main className="py-10 container mx-auto">
        <Outlet />
      </main>
    </>
  );
}

export default App;
