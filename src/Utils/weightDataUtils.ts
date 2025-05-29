import { getItemFromLocalStorage, setItemInLocalStorage } from "./localStorageCore";
import { getDateKey } from "./dateUtils";
// import { IDailyWeightFood } from "../Types/AppTypes"; // Assuming this is your type for daily weight/food

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

export const loadWeightForDay = (date: Date): any | null => { 
   const dateKey = getDateKey(date);
   const allWeights = loadAllWeights();
   return allWeights[dateKey] || null;
};

export const saveWeightForDay = (date: Date, weightData: any): boolean => { 
   const dateKey = getDateKey(date);
   const allWeights = loadAllWeights();
   allWeights[dateKey] = weightData;
   console.log(`Saved weight data for ${dateKey}:`, weightData);
   return saveAllWeights(allWeights);
};

// You might have other weight/food related functions here, like:
// export const loadFoodForDay = (date: Date): IFoodEntry[] | null => { ... };
// export const saveFoodForDay = (date: Date, foodData: IFoodEntry[]): boolean => { ... };