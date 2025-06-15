import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import uk from '../locales/uk.json';
import de from '../locales/de.json';
import ru from '../locales/ru.json';
import { enUS, uk as ukLocale, de as deLocale, ru as ruLocale, Locale } from 'date-fns/locale';

type Language = 'en' | 'uk' | 'de' | 'ru';
type TranslationKey = keyof typeof en | keyof typeof uk | keyof typeof de | keyof typeof ru;

const dateLocales = {
  en: enUS,
  uk: ukLocale,
  de: deLocale,
  ru: ruLocale
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
  getDateLocale: () => Locale;
}

const translations = { en, uk, de, ru };

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    // Check if there's a saved language preference
    const saved = localStorage.getItem('appLang');
    
    // If there's a saved preference and it's in the supported languages list, use it
    if (saved && Object.keys(translations).includes(saved)) {
      return saved as Language;
    }
    
    // Otherwise, try to use the browser's language if supported
    const browserLang = navigator.language.split('-')[0];
    if (Object.keys(translations).includes(browserLang)) {
      return browserLang as Language;
    }
    
    // Default to English if no match
    return 'en';
  });

  useEffect(() => {
    // Save language preference when it changes
    localStorage.setItem('appLang', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: TranslationKey, params?: Record<string, string | number>): string => {
    const currentTranslations = translations[language] as Record<TranslationKey, string>;
    const defaultTranslations = translations.en as Record<TranslationKey, string>;
    let text = currentTranslations[key] || defaultTranslations[key] || key;
    
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        text = text.replace(new RegExp(`\{\{${key}\}\}`, 'g'), String(value));
      });
    }
    
    return text;
  };

  const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat(language).format(date);
  };

  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat(language).format(num);
  };

  const getDateLocale = () => {
    return dateLocales[language] || enUS;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate, formatNumber, getDateLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};