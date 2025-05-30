import { getItemFromLocalStorage, setItemInLocalStorage } from "./localStorageCore";
import { getDateKey } from "./dateUtils";
import { IDailyWeightFood } from "../Types/AppTypes"; // Make sure this is imported

// --- Constants for localStorage Keys ---
const APP_PREFIX = "sport-counter-"; // Prefix for all keys
const WEIGHT_STORAGE_KEY = `${APP_PREFIX}weights`;

// --- Weight Data ---
// Replace 'any' with your actual weight data type e.g. IDailyWeightFood or a specific weight type
const loadAllWeights = (): Record<string, any> => { 
   return getItemFromLocalStorage(WEIGHT_STORAGE_KEY, {});
};

const saveAllWeights = (allWeights: Record<string, any>) => { 
   return setItemInLocalStorage(WEIGHT_STORAGE_KEY, allWeights);
};

export const saveWeightForDay = (date: Date, data: IDailyWeightFood): boolean => { // Ensure 'data' type includes height and age
   const dateKey = getDateKey(date);
   const allWeights = loadAllWeights();
   allWeights[dateKey] = data; // Save the whole object
   console.log(`Saved weight, height, age, and food data for ${dateKey}:`, data);
   return saveAllWeights(allWeights);
};

export const loadWeightForDay = (date: Date): IDailyWeightFood | null => { // Ensure return type includes height and age
   const dateKey = getDateKey(date);
   const allWeights = loadAllWeights();
   return allWeights[dateKey] || null;
};
// export const loadFoodForDay = (date: Date): IFoodEntry[] | null => { ... };
// export const saveFoodForDay = (date: Date, foodData: IFoodEntry[]): boolean => { ... };