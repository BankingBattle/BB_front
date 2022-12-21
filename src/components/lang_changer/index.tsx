import { useTranslation } from "react-i18next";

export function LangChanger() {
  const { i18n } = useTranslation();
  return (
    <button type="button" onClick={() => {
      i18n.language === 'ru' ? i18n.changeLanguage('en') : i18n.changeLanguage('ru')
    }}>
      {i18n.language === 'ru' ? 'EN' : 'RU'}
    </button>
  );
}