import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';

type AppPage = 'exercise' | 'weight' | 'settings';

interface AppContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  previousPage: AppPage | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to get initial page from URL hash
const getInitialPage = (): AppPage => {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'exercise' || hash === 'weight' || hash === 'settings') {
    return hash;
  }
  return 'exercise'; // Default page
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>(getInitialPage());
  const [previousPage, setPreviousPage] = useState<AppPage | null>(null);

  // Update URL when page changes
  useEffect(() => {
    window.location.hash = activePage;
  }, [activePage]);

  // Listen for URL changes
  useEffect(() => {
    const handleHashChange = () => {
      const newPage = getInitialPage();
      if (newPage !== activePage) {
        setPreviousPage(activePage);
        setActivePage(newPage);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [activePage]);

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