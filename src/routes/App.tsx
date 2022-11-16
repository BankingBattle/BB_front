import { Trans } from 'react-i18next';
import { Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <nav>
        <div>
          <Link to="/">
            <Trans>Home</Trans>
          </Link>
        </div>
        <div>
          <Link to="/login">
            <Trans>Login</Trans>
          </Link>
        </div>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default App;
