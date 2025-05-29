import React, { useState, useEffect, useRef } from "react";
import { SetInputRow } from "./SetInputRow";
import { loadUnitPreferences } from "../../Utils/LocalStorageUtils"; // Import loadUnitPreferences
import { WeightUnit } from "../../Types/AppTypes"; // Import WeightUnit

// --- Types ---
// Local type for form state (can include string values)
interface IFormSet {
   id: string;
   reps: string; // Use string for input value
   weight: string; // Use string for input value
   notes?: string; // Add optional notes field
}
// Type from parent (might have number values after validation)
interface IExerciseSet {
   id: string;
   reps: string | number;
   weight?: string | number;
   notes?: string; // Add optional notes field
}
interface IExerciseEntry {
   // Type for initialData
   id: string;
   name: string;
   sets: IExerciseSet[];
}
// --- End Types ---

interface IExerciseFormProps {
   suggestionSource: string[];
   // onSubmit now receives sets that might have string values from the form
   onSubmit: (name: string, sets: IFormSet[]) => void;
   inputClasses: string;
   maxSets: number;
   initialData?: IExerciseEntry | null; // Optional initial data for editing
   onCancelEdit?: () => void; // Optional handler for cancelling edit
}

export const ExerciseForm: React.FC<IExerciseFormProps> = ({
   suggestionSource,
   onSubmit,
   inputClasses,
   maxSets,
   initialData, // Receive initial data
   onCancelEdit, // Receive cancel handler
}) => {
   // Use IFormSet for internal state to match input values
   const [exerciseName, setExerciseName] = useState("");
   const [currentSets, setCurrentSets] = useState<IFormSet[]>([
      { id: Date.now().toString(), reps: "", weight: "", notes: "" }, // Add notes to initial set
   ]);
   const nameInputRef = useRef<HTMLInputElement>(null); // Ref for the name input
   const suggestionsListRef = useRef<HTMLUListElement>(null); // Ref for the suggestions UL

   const [error, setError] = useState<string | null>(null);
   const [suggestions, setSuggestions] = useState<string[]>([]);
   const [currentWeightUnit, setCurrentWeightUnit] = useState<WeightUnit>("kg");

   // Load unit preferences on component mount
   useEffect(() => {
      const preferences = loadUnitPreferences();
      setCurrentWeightUnit(preferences.weight);
   }, []);

   // Effect to populate form when initialData changes (i.e., editing starts)
   useEffect(() => {
      if (initialData) {
         setExerciseName(initialData.name);
         // Map parent sets (which might have numbers) to form sets (strings)
         setCurrentSets(
            initialData.sets.map((set) => ({
               id: set.id,
               reps: String(set.reps), // Ensure string for input
               weight:
                  set.weight !== undefined && set.weight !== null
                     ? String(set.weight)
                     : "", // Ensure string or empty string
               notes:
                  set.notes !== undefined && set.notes !== null
                     ? String(set.notes)
                     : "", // Add notes
            }))
         );
         setError(null);
         setSuggestions([]);
      } else {
         // If initialData is null (not editing), ensure form is reset
         // This might be redundant if the key prop handles it, but safe to include
         setExerciseName("");
         setCurrentSets([
            { id: Date.now().toString(), reps: "", weight: "", notes: "" },
         ]); // Add notes to reset
         setError(null);
         setSuggestions([]);
      }
   }, [initialData]); // Re-run when initialData changes

   // Effect for handling clicks outside the suggestions list
   useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
         // Check if the click is outside the input and the suggestions list
         if (
            nameInputRef.current &&
            !nameInputRef.current.contains(event.target as Node) &&
            suggestionsListRef.current &&
            !suggestionsListRef.current.contains(event.target as Node)
         ) {
            setSuggestions([]); // Hide suggestions
         }
      };

      // Add listener only if suggestions are currently visible
      if (suggestions.length > 0) {
         document.addEventListener("mousedown", handleClickOutside);
      }

      // Cleanup: remove listener when component unmounts or suggestions change
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, [suggestions]); // Dependency array: re-run when 'suggestions' state changes

   // --- Input Handlers ---
   const handleNameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setExerciseName(value);
      if (value.trim().length > 0) {
         const filtered = suggestionSource
            .filter((name) => name.toLowerCase().includes(value.toLowerCase()))
            .slice(0, 10);
         setSuggestions(filtered);
      } else {
         setSuggestions([]);
      }
      if (error) setError(null);
   };

   const handleSuggestionClick = (name: string) => {
      setExerciseName(name);
      setSuggestions([]);
   };

   const handleSetChange = (
      id: string,
      field: "reps" | "weight" | "notes", // Add 'notes' to field type
      value: string
   ) => {
      let processedValue = value;
      if (field === "reps") {
         processedValue = processedValue.replace(/[^0-9]/g, "");
         if (processedValue.length > 1 && processedValue.startsWith("0")) {
            processedValue = processedValue.substring(1);
         }
         const numValue = parseInt(processedValue, 10);
         if (!isNaN(numValue) && numValue > 300) {
            processedValue = "300";
         }
      } else if (field === "weight") {
         processedValue = processedValue.replace(/[^0-9.]/g, "");
         const decimalParts = processedValue.split(".");
         if (decimalParts.length > 2) {
            processedValue = `${decimalParts[0]}.${decimalParts
               .slice(1)
               .join("")}`;
         }
         if (
            processedValue.length > 1 &&
            processedValue.startsWith("0") &&
            !processedValue.startsWith("0.")
         ) {
            processedValue = processedValue.substring(1);
         }
         if (parseFloat(processedValue) < 0) {
            processedValue = "0";
         }
      }

      // For 'notes', we typically don't need much processing unless there's a max length
      // For now, we'll just take the value as is for notes.

      setCurrentSets((prevSets) =>
         prevSets.map((set) =>
            set.id === id ? { ...set, [field]: processedValue } : set
         )
      );
      if (error) setError(null);
   };

   const handleAddSet = () => {
      if (currentSets.length >= maxSets) {
         setError(`You can add a maximum of ${maxSets} sets.`);
         setTimeout(() => setError(null), 3000);
         return;
      }
      setCurrentSets((prevSets) => [
         ...prevSets,
         { id: Date.now().toString(), reps: "", weight: "", notes: "" }, // Add notes to new set
      ]);
   };

   const handleDeleteSet = (idToDelete: string) => {
      if (currentSets.length <= 1) {
         setError("You must have at least one set.");
         setTimeout(() => setError(null), 3000);
         return;
      }
      setCurrentSets((prevSets) =>
         prevSets.filter((set) => set.id !== idToDelete)
      );
   };

   // --- Form Submission Handler ---
   const handleFormSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setError(null);
      const trimmedName = exerciseName.trim();

      if (!trimmedName) {
         setError("Exercise name cannot be empty.");
         return;
      }

      // Validate sets directly from form state (strings) before submitting
      const validatedSets: IFormSet[] = []; // Keep as IFormSet for now
      let isValid = true;

      for (const [index, set] of currentSets.entries()) {
         if (set.reps === "" || set.reps === null || set.reps === undefined) {
            setError(`Set ${index + 1}: Reps cannot be empty.`);
            isValid = false;
            break;
         }
         // Perform number conversion *for validation only* here
         const repsNum = Number(set.reps);
         const weightNum = set.weight !== "" ? Number(set.weight) : undefined;

         if (isNaN(repsNum) || repsNum <= 0 || repsNum > 300) {
            setError(
               `Set ${index + 1}: Reps must be a number between 1 and 300.`
            );
            isValid = false;
            break;
         }
         if (
            set.weight !== "" &&
            (isNaN(weightNum as number) || (weightNum as number) < 0)
         ) {
            setError(
               `Set ${index + 1}: Weight must be a positive number or empty.`
            );
            isValid = false;
            break;
         }
         // Add the set with string values (as they are in the form state)
         // Notes are optional and don't need specific validation here beyond being a string
         validatedSets.push(set);
      }

      if (!isValid) return;
      if (validatedSets.length === 0) {
         setError("You must add at least one valid set.");
         return;
      }

      // Call the onSubmit prop passed from the parent with validated form data
      // The parent (Exercise.tsx) will handle converting strings back to numbers if needed before saving
      onSubmit(trimmedName, validatedSets);

      // Resetting form state is now handled by the key prop change or useEffect in parent
      // setExerciseName("");
      // setCurrentSets([{ id: Date.now().toString(), reps: "", weight: "" }]);
      // setSuggestions([]);
      // setError(null);
   };

   const isEditing = !!initialData; // Check if we are in edit mode

   // Define enhanced input classes locally for better focus visibility etc.
   const enhancedInputClasses = `${inputClasses} focus:ring-offset-2 focus:ring-2`; // Add offset and thicker ring

   return (
      // Adjusted bottom margin
      <form onSubmit={handleFormSubmit} className="space-y-5 sm:space-y-6 mb-6">
         {/* Exercise Name Input */}
         <div className="relative">
            <label
               htmlFor="exerciseName"
               className="block text-sm font-medium text-gray-700 mb-1.5"
            >
               Exercise Name
            </label>
            <input
               type="text"
               id="exerciseName"
               value={exerciseName}
               onChange={handleNameInputChange}
               ref={nameInputRef} // Add ref to the input
               // Use enhanced classes
               className={enhancedInputClasses}
               placeholder="e.g., Barbell Bench Press"
               required
               autoComplete="off"
            />
            {/* Suggestions - styling seems okay, ensure z-index is sufficient if needed */}
            {suggestions.length > 0 && (
               <ul
                  ref={suggestionsListRef} // Add ref to the suggestions list
                  className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto"
               >
                  {suggestions.map((name, index) => (
                     <li
                        key={index}
                        onClick={() => handleSuggestionClick(name)}
                        // Added break-words class for long names
                        className="px-4 py-2.5 text-sm text-gray-700 hover:bg-brand-green/10 cursor-pointer transition-colors duration-100 ease-in-out break-words"
                     >
                        {name}
                     </li>
                  ))}
               </ul>
            )}
         </div>

         {/* Sets Input Section */}
         {/* Adjusted spacing */}
         <div className="space-y-3 sm:space-y-4 pt-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
               Sets
            </label>
            {currentSets.map((set, index) => (
               <SetInputRow
                  key={set.id}
                  set={set}
                  index={index}
                  // Pass enhanced classes down
                  inputClasses={enhancedInputClasses}
                  isOnlySet={currentSets.length <= 1}
                  onSetChange={handleSetChange} // Ensure this is passed correctly
                  onDeleteSet={handleDeleteSet}
                  currentWeightUnit={currentWeightUnit} // Pass the unit here
               />
            ))}
            {/* Add Set Button - slightly adjusted styles */}
            <button
               type="button"
               onClick={handleAddSet}
               disabled={currentSets.length >= maxSets}
               className={`w-full mt-3 px-4 py-2.5 border border-gray-300 text-sm font-medium rounded-lg flex items-center justify-center space-x-1.5 transition-all duration-150 ease-in-out group ${
                  currentSets.length >= maxSets
                     ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                     : // Subtle hover/focus for enabled state
                       "text-gray-600 bg-white hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-brand-green/50"
               }`}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500 group-hover:text-gray-600 transition-colors"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M12 4v16m8-8H4"
                  />
               </svg>
               <span className="group-hover:text-gray-700 transition-colors">
                  ADD SET
               </span>
            </button>
         </div>

         {/* Error Message - Add an icon */}
         {error && (
            <div className="flex items-start space-x-3 text-sm font-medium text-red-700 mt-4 bg-red-50 p-3.5 rounded-lg border border-red-200">
               {/* Error Icon */}
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 flex-shrink-0 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
               >
                  <path
                     fillRule="evenodd"
                     d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                     clipRule="evenodd"
                  />
               </svg>
               <span>{error}</span>
            </div>
         )}

         {/* Submit/Update and Cancel Buttons */}
         {/* Removed pt-3 sm:pt-4 from this div */}
         <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
            <button
               type="submit"
               // Adjusted padding, text size, slightly softer
               className={`w-full sm:w-auto order-1 sm:order-2 px-6 py-3 text-white text-sm font-semibold rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-150 ease-in-out ${
                  isEditing
                     ? "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                     : "bg-brand-green hover:bg-brand-green-dark focus:ring-brand-green"
               }`}
            >
               {isEditing ? "Update Exercise" : "Add Exercise"}{" "}
               {/* Shortened text */}
            </button>

            {isEditing && onCancelEdit && (
               <button
                  type="button"
                  onClick={onCancelEdit}
                  // Adjusted padding, text size, consistent styling with submit
                  className="w-full sm:w-auto order-2 sm:order-1 px-6 py-3 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg shadow-sm hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 transition duration-150 ease-in-out"
               >
                  Cancel
               </button>
            )}
         </div>
      </form>
   );
};
