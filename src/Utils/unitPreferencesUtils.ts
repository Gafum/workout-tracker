import { IUnitPreferences } from "../Types/AppTypes";
import { getItemFromLocalStorage, setItemInLocalStorage } from "./localStorageCore";

// --- Constants for localStorage Keys ---
const APP_PREFIX = "sport-counter-"; // Prefix for all keys
const UNIT_PREFERENCES_KEY = `${APP_PREFIX}unit-preferences`;

// --- Unit Preferences --- 

export const saveUnitPreferences = (preferences: IUnitPreferences): boolean => {
  return setItemInLocalStorage(UNIT_PREFERENCES_KEY, preferences);
};

export const loadUnitPreferences = (): IUnitPreferences => {
  const defaultPreferences: IUnitPreferences = {
    weight: 'kg',
    height: 'cm',
  };
  const storedPreferences = getItemFromLocalStorage<IUnitPreferences | null>(UNIT_PREFERENCES_KEY, null);

  if (storedPreferences && 
      typeof storedPreferences.weight === 'string' && 
      typeof storedPreferences.height === 'string' &&
      ['kg', 'lbs'].includes(storedPreferences.weight) &&
      ['cm', 'ft'].includes(storedPreferences.height)) {
    return storedPreferences as IUnitPreferences;
  }
  return defaultPreferences;
};