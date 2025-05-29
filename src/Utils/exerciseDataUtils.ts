import { IExerciseEntry } from "../Types/AppTypes";
import { getItemFromLocalStorage, setItemInLocalStorage } from "./localStorageCore";
import { getDateKey } from "./dateUtils";
import { POPULAR_EXERCISES } from "./PopularExercises";
import { loadUnitPreferences } from "./unitPreferencesUtils";
import { format, startOfDay, eachDayOfInterval, subDays } from "date-fns"; // Added subDays

// --- Constants for localStorage Keys ---
const APP_PREFIX = "sport-counter-"; // Prefix for all keys
const EXERCISE_STORAGE_KEY = `${APP_PREFIX}exercises`;
const EXERCISE_NAMES_KEY = `${APP_PREFIX}exercise-names`;

// --- Exercise Data ---

const loadAllExercises = (): Record<string, IExerciseEntry[]> => {
   return getItemFromLocalStorage(EXERCISE_STORAGE_KEY, {});
};

const saveAllExercises = (allExercises: Record<string, IExerciseEntry[]>) => {
   return setItemInLocalStorage(EXERCISE_STORAGE_KEY, allExercises);
};

export const loadExercisesForDay = (date: Date): IExerciseEntry[] => {
   const dateKey = getDateKey(date);
   const allExercises = loadAllExercises();
   return allExercises[dateKey] || [];
};

export const saveExercisesForDay = (date: Date, exercises: IExerciseEntry[]): boolean => {
   const dateKey = getDateKey(date);
   const allExercises = loadAllExercises();
   allExercises[dateKey] = exercises;
   if (saveAllExercises(allExercises)) {
      updateExerciseNamesList(exercises); // Update names only if save was successful
      console.log(`Saved exercises for ${dateKey}:`, exercises);
      return true;
   }
   return false;
};

// --- Exercise Names (for autocomplete and management) ---

const updateExerciseNamesList = (exercises: IExerciseEntry[]) => {
   const existingNames = getAllExerciseNames();
   const standardExercisesLower = POPULAR_EXERCISES.map(name => name.toLowerCase());

   const newNamesFromEntries = exercises
      .map((ex) => ex.name.trim())
      .filter((name) => name && !standardExercisesLower.includes(name.toLowerCase()));

   const combinedNames = Array.from(
      new Set([...existingNames, ...newNamesFromEntries])
   ).sort(); 

   setItemInLocalStorage(EXERCISE_NAMES_KEY, combinedNames);
};

export const getAllExerciseNames = (): string[] => {
   return getItemFromLocalStorage(EXERCISE_NAMES_KEY, []);
};

export const updateExerciseName = (oldName: string, newName: string): boolean => {
   const exerciseNames = getAllExerciseNames();
   const oldNameLower = oldName.toLowerCase();
   const index = exerciseNames.findIndex((name) => name.toLowerCase() === oldNameLower);

   if (index !== -1) {
      exerciseNames[index] = newName.trim();
      if (setItemInLocalStorage(EXERCISE_NAMES_KEY, exerciseNames)) {
         updateExerciseNameInSavedExercises(oldName, newName.trim());
         return true;
      }
   }
   return false;
};

export const removeExerciseName = (exerciseName: string): boolean => {
   const exerciseNames = getAllExerciseNames();
   const nameToRemoveLower = exerciseName.toLowerCase();
   const updatedNames = exerciseNames.filter((name) => name.toLowerCase() !== nameToRemoveLower);

   if (updatedNames.length < exerciseNames.length) { 
      return setItemInLocalStorage(EXERCISE_NAMES_KEY, updatedNames);
   }
   return false; 
};

const updateExerciseNameInSavedExercises = (oldName: string, newName: string): void => {
   const allExercises = loadAllExercises();
   let changedInAnyDay = false;
   const oldNameLower = oldName.toLowerCase();

   Object.keys(allExercises).forEach((dateKey) => {
      let updatedInDay = false;
      allExercises[dateKey] = allExercises[dateKey].map((exercise) => {
         if (exercise.name.toLowerCase() === oldNameLower) {
            updatedInDay = true;
            return { ...exercise, name: newName };
         }
         return exercise;
      });
      if (updatedInDay) changedInAnyDay = true;
   });

   if (changedInAnyDay) {
      saveAllExercises(allExercises);
   }
};

// --- Formatted Exercise Data Retrieval ---

// Get exercises for a specified date range and format them nicely 
export const getExercisesForDateRangeFormatted = ( 
    startDate: Date, 
    endDate: Date 
): string => { 
    try { 
       const unitPreferences = loadUnitPreferences(); // Load unit preferences
       const currentWeightUnit = unitPreferences.weight; // Get the current weight unit

       const dates = eachDayOfInterval({ 
          start: startOfDay(startDate), 
          end: startOfDay(endDate), 
       }); 
       const numberOfDays = dates.length; 
       let formattedOutput = `Workout Summary (${format( 
          startDate, 
          "yyyy-MM-dd" 
       )} to ${format(endDate, "yyyy-MM-dd")}) - ${numberOfDays} Day(s):\n\n`; 
       let hasData = false; 
 
       for (const date of dates) { 
          const exercisesForDay = loadExercisesForDay(date) as IExerciseEntry[]; // Cast to IExerciseEntry[] 
 
          if (exercisesForDay && exercisesForDay.length > 0) { 
             hasData = true; 
             formattedOutput += `--- ${format(date, "yyyy-MM-dd (EEE)")} ---\n`; 
             exercisesForDay.forEach((exercise) => { 
                formattedOutput += `  ${exercise.name}:\n`; 
                exercise.sets.forEach((set, index) => { 
                   formattedOutput += `    Set ${index + 1}: ${set.reps} reps`; 
                   if ( 
                      set.weight !== undefined && 
                      set.weight !== null && 
                      set.weight !== "" 
                   ) { 
                      // Use the dynamic weight unit here
                      formattedOutput += ` x ${set.weight}${currentWeightUnit}`; 
                   } 
                   if (set.notes && set.notes.trim() !== "") { 
                      formattedOutput += ` (Notes: ${set.notes.trim()})`; 
                   } 
                   formattedOutput += "\n"; 
                }); 
                formattedOutput += "\n"; // Add a blank line after each exercise block 
             }); 
             formattedOutput += "\n"; // Add a blank line between days 
          } 
       } 
 
       if (!hasData) { 
          return "No exercise data found for the selected date range."; 
       } 
 
       return formattedOutput.trim(); // Remove trailing newline/space 
    } catch (error) { 
       console.error("Error getting exercises for date range:", error); 
       return "Error retrieving exercise data."; 
    } 
 };

export const getExercisesLastWeekFormatted = (): string => {
  const today = startOfDay(new Date());
  const sevenDaysAgo = startOfDay(subDays(today, 6)); // Ensure it's exactly 7 days including today
  return getExercisesForDateRangeFormatted(sevenDaysAgo, today);
};