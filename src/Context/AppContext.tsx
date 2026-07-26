import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import {
  loadActivePlanDayIndex,
  loadActivePlanId,
  loadSavedCustomPlans,
  saveActivePlanDayIndex,
  saveActivePlanId,
  saveCustomPlans,
} from '../Utils/planUtils';
import { IWorkoutPlan } from '../Types/plan';
import { PRESET_WORKOUT_PLANS } from "../constants/presetPlans";

type AppPage = 'exercise' | 'weight' | 'settings' | 'plans';

interface AppContextType {
  activePage: AppPage;
  setActivePage: (page: AppPage) => void;
  previousPage: AppPage | null;
  activePlanId: string | null;
  setActivePlanId: (planId: string | null) => void;
  activePlanDayIndex: number;
  setActivePlanDayIndex: (dayIndex: number) => void;
  customPlans: IWorkoutPlan[];
  saveCustomPlans: (plans: IWorkoutPlan[]) => void;
  activePlan?: IWorkoutPlan;
  allPlans: IWorkoutPlan[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Helper function to get initial page from URL hash
const getInitialPage = (): AppPage => {
  const hash = window.location.hash.replace('#', '');
  if (hash === 'exercise' || hash === 'weight' || hash === 'settings' || hash === 'plans') {
    return hash;
  }
  return 'exercise'; // Default page
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activePage, setActivePage] = useState<AppPage>(getInitialPage());
  const [previousPage, setPreviousPage] = useState<AppPage | null>(null);
  const [activePlanId, setActivePlanId] = useState<string | null>(loadActivePlanId());
  const [activePlanDayIndex, setActivePlanDayIndex] = useState<number>(loadActivePlanDayIndex());
  const [customPlans, setCustomPlansState] = useState<IWorkoutPlan[]>(loadSavedCustomPlans());


  const allPlans = useMemo(
    () => [...PRESET_WORKOUT_PLANS, ...customPlans],
    [customPlans]
  );
  const activePlan = useMemo(
    () => allPlans.find((plan) => plan.id === activePlanId),
    [allPlans, activePlanId]
  );

  // Update URL when page changes
  useEffect(() => {
    window.location.hash = activePage;
  }, [activePage]);

  useEffect(() => {
    saveActivePlanId(activePlanId);
  }, [activePlanId]);

  useEffect(() => {
    saveActivePlanDayIndex(activePlanDayIndex);
  }, [activePlanDayIndex]);

  useEffect(() => {
    saveCustomPlans(customPlans);
  }, [customPlans]);

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

  const handleSetActivePlanId = (planId: string | null) => {
    setActivePlanId(planId);
    if (planId === null) {
      setActivePlanDayIndex(0);
    }
  };

  const handleSetCustomPlans = (plans: IWorkoutPlan[]) => {
    setCustomPlansState(plans);
  };

  return (
    <AppContext.Provider
      value={{
        activePage,
        setActivePage: handleSetActivePage,
        previousPage,
        activePlanId,
        setActivePlanId: handleSetActivePlanId,
        activePlanDayIndex,
        setActivePlanDayIndex,
        customPlans,
        saveCustomPlans: handleSetCustomPlans,
        activePlan,
        allPlans,
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