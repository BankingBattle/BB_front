import { GamesList } from '../components/GamesList';
import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <>
      <GamesList />
      <a
        className="mx-1 my-5 px-3 py-2 rounded-md transition-colors bg-purple-500 text-white block"
        href="create">
        + {t('Create game')}
      </a>
    </>
  );
}

export default Home;
