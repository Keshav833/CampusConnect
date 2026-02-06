import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enTranslations from "./locales/en.json";
import hiTranslations from "./locales/hi.json";
import guTranslations from "./locales/gu.json";
import mrTranslations from "./locales/mr.json";
import bnTranslations from "./locales/bn.json";
import taTranslations from "./locales/ta.json";

import enContent from "./locales/content/en.json";
import hiContent from "./locales/content/hi.json";
import guContent from "./locales/content/gu.json";
import mrContent from "./locales/content/mr.json";
import bnContent from "./locales/content/bn.json";
import taContent from "./locales/content/ta.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations, content: enContent },
      hi: { translation: hiTranslations, content: hiContent },
      gu: { translation: guTranslations, content: guContent },
      mr: { translation: mrTranslations, content: mrContent },
      bn: { translation: bnTranslations, content: bnContent },
      ta: { translation: taTranslations, content: taContent },
    },
    fallbackLng: "en",
    ns: ["translation", "content"],
    defaultNS: "translation",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
