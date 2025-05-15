// Import necessary date functions
import { format } from "date-fns";
import { POPULAR_EXERCISES } from "./PopularExercises";

// Constants
const EXERCISE_STORAGE_KEY = "sport-counter-exercises";
const WEIGHT_STORAGE_KEY = "sport-counter-weights";
const EXERCISE_NAMES_KEY = "sport-counter-exercise-names";

// Helper to create a consistent date key
const getDateKey = (date: Date): string => {
   return format(date, "yyyy-MM-dd");
};

// Load all exercises data
const loadAllExercises = (): Record<string, any[]> => {
   try {
      const storedData = localStorage.getItem(EXERCISE_STORAGE_KEY);
      if (!storedData) {
         return {};
      }
      return JSON.parse(storedData);
   } catch (error) {
      console.error("Error loading all exercises:", error);
      return {};
   }
};

// Save all exercises data
const saveAllExercises = (allExercises: Record<string, any[]>) => {
   try {
      localStorage.setItem(EXERCISE_STORAGE_KEY, JSON.stringify(allExercises));
      return true;
   } catch (error) {
      console.error("Error saving all exercises:", error);
      return false;
   }
};

// Load exercises for a specific day
export const loadExercisesForDay = (date: Date) => {
   try {
      const dateKey = getDateKey(date);
      const allExercises = loadAllExercises();

      if (!allExercises[dateKey]) {
         console.log(`No data found for date: ${dateKey}`);
         return [];
      }

      return allExercises[dateKey];
   } catch (error) {
      console.error("Error loading exercises for day:", error);
      return [];
   }
};

// Save exercises for a specific day
export const saveExercisesForDay = (date: Date, exercises: any[]) => {
   try {
      const dateKey = getDateKey(date);
      const allExercises = loadAllExercises();

      // Update exercises for this date
      allExercises[dateKey] = exercises;

      // Save all exercises
      saveAllExercises(allExercises);

      // Also update the exercise names list
      updateExerciseNamesList(exercises);

      console.log(`Saved exercises for ${dateKey}:`, exercises);
      return true;
   } catch (error) {
      console.error("Error saving exercises for day:", error);
      return false;
   }
};

// Keep track of all exercise names for autocomplete
const updateExerciseNamesList = (exercises: any[]) => {
   try {
      const existingNames = getAllExerciseNames();
      const standardExercises = POPULAR_EXERCISES || []; // Import this at the top of the file
      
      // Only add names that aren't in the standard list
      const newNames = exercises
         .map((ex) => ex.name)
         .filter((name) => 
            name && 
            typeof name === "string" && 
            !standardExercises.includes(name)
         );

      // Combine and deduplicate
      const combinedNames = Array.from(
         new Set([...existingNames, ...newNames])
      );
      localStorage.setItem(EXERCISE_NAMES_KEY, JSON.stringify(combinedNames));
   } catch (error) {
      console.error("Error updating exercise names list:", error);
   }
};

// Get all exercise names for autocomplete
export const getAllExerciseNames = (): string[] => {
   try {
      const storedNames = localStorage.getItem(EXERCISE_NAMES_KEY);
      if (!storedNames) return [];
      return JSON.parse(storedNames);
   } catch (error) {
      console.error("Error getting exercise names:", error);
      return [];
   }
};

// Load all weights data
const loadAllWeights = (): Record<string, any> => {
   try {
      const storedData = localStorage.getItem(WEIGHT_STORAGE_KEY);
      if (!storedData) {
         return {};
      }
      return JSON.parse(storedData);
   } catch (error) {
      console.error("Error loading all weights:", error);
      return {};
   }
};

// Save all weights data
const saveAllWeights = (allWeights: Record<string, any>) => {
   try {
      localStorage.setItem(WEIGHT_STORAGE_KEY, JSON.stringify(allWeights));
      return true;
   } catch (error) {
      console.error("Error saving all weights:", error);
      return false;
   }
};

// Load weight data for a specific day
export const loadWeightForDay = (date: Date) => {
   try {
      const dateKey = getDateKey(date);
      const allWeights = loadAllWeights();

      if (!allWeights[dateKey]) {
         console.log(`No weight data found for date: ${dateKey}`);
         return null;
      }

      return allWeights[dateKey];
   } catch (error) {
      console.error("Error loading weight data for day:", error);
      return null;
   }
};

// Save weight data for a specific day
export const saveWeightForDay = (date: Date, weightData: any) => {
   try {
      const dateKey = getDateKey(date);
      const allWeights = loadAllWeights();

      // Update weight for this date
      allWeights[dateKey] = weightData;

      // Save all weights
      saveAllWeights(allWeights);

      console.log(`Saved weight data for ${dateKey}:`, weightData);
      return true;
   } catch (error) {
      console.error("Error saving weight data for day:", error);
      return false;
   }
};
