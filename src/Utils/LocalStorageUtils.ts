// This file now re-exports functionalities from more specific utility modules.

// From localStorageCore.ts (if needed directly, though mostly used by other utils)
// export { getItemFromLocalStorage, setItemInLocalStorage } from './localStorageCore';

// From dateUtils.ts (if needed directly, though mostly used by other utils)
// export { getDateKey } from './dateUtils';

// From unitPreferencesUtils.ts
export {
   saveUnitPreferences,
   loadUnitPreferences,
} from "./unitPreferencesUtils";

// From exerciseDataUtils.ts
export {
   loadExercisesForDay,
   saveExercisesForDay,
   getAllExerciseNames,
   updateExerciseName,
   removeExerciseName,
   getExercisesForDateRangeFormatted,
   getExercisesLastWeekFormatted,
} from "./exerciseDataUtils";

// From weightDataUtils.ts
export { loadWeightForDay, saveWeightForDay } from "./weightDataUtils";

// Import types that might be used by the re-exported functions' signatures if not already globally available
// export type { IExerciseEntry, IUnitPreferences, WeightUnit, HeightUnit } from "../Types/AppTypes";

// Note: Functions like loadAllExercises, saveAllExercises, updateExerciseNamesList, etc.,
// which were internal to the original LocalStorageUtils.ts and are now internal to their respective new modules,
// are not re-exported unless they need to be accessed directly from outside the Utils folder.
