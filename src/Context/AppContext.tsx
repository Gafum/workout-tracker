import React, { createContext, useState, useContext, ReactNode } from 'react';

type AppPage = 'exercise' | 'weight' | 'settings';

interface AppContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  previousPage: AppPage | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>('exercise');
  const [previousPage, setPreviousPage] = useState<AppPage | null>(null);

  const handleSetActivePage = (page: AppPage) => {
    setPreviousPage(activePage);
    setActivePage(page);
  };

  return (
    <AppContext.Provider 
      value={{ 
        activePage, 
        setActivePage: handleSetActivePage,
        previousPage
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};