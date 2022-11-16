import { useTranslation } from 'react-i18next';

function Home() {
  const { t } = useTranslation();

  return <>{t('Home')}</>;
}

export default Home;
