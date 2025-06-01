import { IUnitPreferences } from '../Types/AppTypes';

const APP_PREFIX = 'sportCounterApp_';
const UNIT_PREFERENCES_KEY = `${APP_PREFIX}unitPreferences`;

const DEFAULT_PREFERENCES: IUnitPreferences = {
   weight: 'kg',
   height: 'cm',
   calendarWeekStart: 'monday', // Default to Monday
};

export const loadUnitPreferences = (): IUnitPreferences => {
   try {
      const storedPreferences = localStorage.getItem(UNIT_PREFERENCES_KEY);
      if (storedPreferences) {
         const parsed = JSON.parse(storedPreferences);
         // Ensure all keys are present, falling back to defaults if not
         return {
            weight: parsed.weight || DEFAULT_PREFERENCES.weight,
            height: parsed.height || DEFAULT_PREFERENCES.height,
            calendarWeekStart: parsed.calendarWeekStart || DEFAULT_PREFERENCES.calendarWeekStart,
         };
      }
   } catch (error) {
      console.error("Failed to load unit preferences:", error);
   }
   return DEFAULT_PREFERENCES;
};

export const saveUnitPreferences = (preferences: IUnitPreferences): void => {
   try {
      // Basic validation before saving
      if (!['kg', 'lbs'].includes(preferences.weight)) {
         throw new Error('Invalid weight unit');
      }
      if (!['cm', 'ft/in'].includes(preferences.height)) {
         throw new Error('Invalid height unit');
      }
      if (!['sunday', 'monday'].includes(preferences.calendarWeekStart)) {
         throw new Error('Invalid calendar week start day');
      }
      localStorage.setItem(UNIT_PREFERENCES_KEY, JSON.stringify(preferences));
   } catch (error) {
      console.error("Failed to save unit preferences:", error);
      // Optionally, notify the user or handle the error more gracefully
   }
};