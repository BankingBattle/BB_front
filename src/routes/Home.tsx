import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return (
    <div className="bg-white px-10 py-5 mx-auto lg:rounded-2xl shadow-sm">
      <h1 className="text-xl font-semibold">{t('Home')}</h1>
    </div>
  );
}

export default Home;
