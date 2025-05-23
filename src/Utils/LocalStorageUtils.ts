// Import necessary date functions
import { format, subDays, startOfDay } from "date-fns"; // Added startOfDay
import { POPULAR_EXERCISES } from "./PopularExercises";
import { IExerciseEntry } from "../Types/AppTypes"; // Import IExerciseEntry type

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
            !standardExercises.some(stdName => stdName.toLowerCase() === name.toLowerCase())
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

// Update an exercise name in the saved list
export const updateExerciseName = (oldName: string, newName: string): boolean => {
  try {
    // Get current exercise names
    const exerciseNames = getAllExerciseNames();
    
    // Find the index of the old name
    const index = exerciseNames.findIndex(
      name => name.toLowerCase() === oldName.toLowerCase()
    );
    
    // If found, update it
    if (index !== -1) {
      exerciseNames[index] = newName;
      localStorage.setItem(EXERCISE_NAMES_KEY, JSON.stringify(exerciseNames));
      
      // Also update the name in all saved exercises
      updateExerciseNameInSavedExercises(oldName, newName);
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Error updating exercise name:", error);
    return false;
  }
};

// Remove an exercise name from the saved list
export const removeExerciseName = (exerciseName: string): boolean => {
  try {
    // Get current exercise names
    const exerciseNames = getAllExerciseNames();
    
    // Filter out the name to remove
    const updatedNames = exerciseNames.filter(
      name => name.toLowerCase() !== exerciseName.toLowerCase()
    );
    
    // Save the updated list
    localStorage.setItem(EXERCISE_NAMES_KEY, JSON.stringify(updatedNames));
    
    return true;
  } catch (error) {
    console.error("Error removing exercise name:", error);
    return false;
  }
};

// Update exercise name in all saved exercises
const updateExerciseNameInSavedExercises = (oldName: string, newName: string): void => {
  try {
    const allExercises = loadAllExercises();
    
    // Go through each day's exercises
    Object.keys(allExercises).forEach(dateKey => {
      const dayExercises = allExercises[dateKey];
      
      // Check if any exercise on this day needs updating
      let updated = false;
      dayExercises.forEach(exercise => {
        if (exercise.name.toLowerCase() === oldName.toLowerCase()) {
          exercise.name = newName;
          updated = true;
        }
      });
      
      // If we updated any exercise, save the changes
      if (updated) {
        allExercises[dateKey] = dayExercises;
      }
    });
    
    // Save all updated exercises
    saveAllExercises(allExercises);
  } catch (error) {
    console.error("Error updating exercise name in saved exercises:", error);
  }
};

// Get exercises for the last 7 days and format them nicely
export const getExercisesLastWeekFormatted = (): string => {
  try {
    const today = startOfDay(new Date());
    let formattedOutput = "Workout Summary (Last 7 Days):\n\n";
    let hasData = false;

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const exercisesForDay = loadExercisesForDay(date) as IExerciseEntry[]; // Cast to IExerciseEntry[]

      if (exercisesForDay && exercisesForDay.length > 0) {
        hasData = true;
        formattedOutput += `--- ${format(date, "yyyy-MM-dd (EEE)")} ---\n`;
        exercisesForDay.forEach(exercise => {
          formattedOutput += `  ${exercise.name}:\n`;
          exercise.sets.forEach((set, index) => {
            formattedOutput += `    Set ${index + 1}: ${set.reps} reps`;
            if (set.weight !== undefined && set.weight !== null && set.weight !== "") {
              // Changed '@' to 'x' and added space
              formattedOutput += ` x ${set.weight} kg`;
            }
            formattedOutput += "\n";
          });
          formattedOutput += "\n"; // Add a blank line after each exercise block
        });
        formattedOutput += "\n"; // Add a blank line between days
      }
    }

    if (!hasData) {
      return "No exercise data found for the last 7 days.";
    }

    return formattedOutput.trim(); // Remove trailing newline/space
  } catch (error) {
    console.error("Error getting exercises for last week:", error);
    return "Error retrieving exercise data.";
  }
};
