import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../locales/en.json';
import uk from '../locales/uk.json';
import de from '../locales/de.json';
import ru from '../locales/ru.json';

type Language = 'en' | 'uk' | 'de' | 'ru';
type TranslationKey = keyof typeof en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey, params?: Record<string, string | number>) => string;
  formatDate: (date: Date) => string;
  formatNumber: (num: number) => string;
}

const translations = { en, uk, de, ru };

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
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

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, formatDate, formatNumber }}>
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