import React, { useState, useEffect, useRef } from "react";
import {
   loadExercisesForDay,
   saveExercisesForDay,
   getAllExerciseNames,
} from "../../Utils/LocalStorageUtils";
import { format } from "date-fns";
// ...
// --- Import the new LoggedExerciseList component ---
import { LoggedExerciseList } from "../../Components/ExercisePage/LoggedExerciseList"; // Added import
import { useLanguage } from "../../Context/LanguageContext"; // Add this import

import { IExerciseSet, IExerciseEntry } from "../../Types/AppTypes";
import { de, enUS, Locale, ru, uk } from "date-fns/locale";
import { ExerciseForm } from "../../Components/ExerciseForm/ExerciseForm";
import { ImportModal } from "../../Components/ExercisePage/ImportModal";
import { POPULAR_EXERCISES } from "../../locales/PopularExercises/PopularExercises";

interface IExerciseProps {
   selectedDate: Date;
}

const MAX_SETS = 10; // Define a reasonable maximum number of sets

export const Exercise: React.FC<IExerciseProps> = ({ selectedDate }) => {
   const { t, language } = useLanguage(); // Add this line to use translations
   // --- State ---
   const [dailyExercises, setDailyExercises] = useState<IExerciseEntry[]>([]);
   const [suggestionSource, setSuggestionSource] = useState<string[]>([]);
   const [editingExercise, setEditingExercise] =
      useState<IExerciseEntry | null>(null);
   const [formKey, setFormKey] = useState<string>(`new-${Date.now()}`);
   const [showCalendar, setShowCalendar] = useState<boolean>(false); // For Import Modal visibility
   const [importDate, setImportDate] = useState<Date | null>(null);
   const [importExercises, setImportExercises] = useState<IExerciseEntry[]>([]);
   const calendarRef = useRef<HTMLDivElement>(null); // Ref for the import modal
   const [selectedToImport, setSelectedToImport] = useState<string[]>([]);

   useEffect(() => {
      if (showCalendar) {
         document.body.style.overflow = "hidden";
      } else {
         document.body.style.overflow = "auto";
      }
   }, [showCalendar]);

   useEffect(() => {
      const loadedData = loadExercisesForDay(selectedDate);

      const validatedExercises: IExerciseEntry[] = Array.isArray(loadedData)
         ? loadedData
              .map((item: any) => {
                 if (item && typeof item.name === "string" && item.id) {
                    return {
                       ...item,
                       name: item.name,
                       id: item.id,
                       sets: Array.isArray(item.sets) ? item.sets : [],
                    };
                 }
                 return null;
              })
              .filter((item): item is IExerciseEntry => item !== null)
         : [];

      setDailyExercises(validatedExercises);
      // Fix: Create combinedUniqueNames from POPULAR_EXERCISES and saved exercises
      const savedExerciseNames = getAllExerciseNames();
      const combinedUniqueNames = Array.from(
         new Set([
            ...(POPULAR_EXERCISES[language as keyof typeof POPULAR_EXERCISES] ||
               []),
            ...savedExerciseNames,
         ])
      );
      setSuggestionSource(combinedUniqueNames);

      // Reset editing state AND form key when date changes
      setEditingExercise(null);
      setFormKey(`new-${Date.now()}`);
   }, [selectedDate, language]);

   // --- Handlers ---
   const handleFormSubmit = (name: string, sets: IExerciseSet[]) => {
      let updatedExercises;

      if (editingExercise) {
         // --- UPDATE logic ---
         updatedExercises = dailyExercises.map((ex) =>
            ex.id === editingExercise.id
               ? { ...ex, name: name, sets: sets }
               : ex
         );
      } else {
         // --- ADD logic ---
         const newEntry: IExerciseEntry = {
            id: Date.now().toString(),
            name: name,
            sets: sets,
            details: null, // Added missing 'details' property
         };
         updatedExercises = [...dailyExercises, newEntry];
         if (
            !suggestionSource.some(
               (n) => n.toLowerCase() === name.toLowerCase()
            )
         ) {
            setSuggestionSource((prevSource) => [name, ...prevSource]);
         }
      }

      setDailyExercises(updatedExercises);
      saveExercisesForDay(selectedDate, updatedExercises as any); // Keep type assertion for now

      // --- Reset state AFTER successful save ---
      setEditingExercise(null); // Exit editing mode
      setFormKey(`new-${Date.now()}`); // Change the key to reset the form
   };

   const handleEditExercise = (idToEdit: string) => {
      const exerciseToEdit = dailyExercises.find((ex) => ex.id === idToEdit);
      if (exerciseToEdit) {
         setEditingExercise(exerciseToEdit);
         // The key will change automatically when ExerciseForm re-renders with new initialData
         // No need to setFormKey here, the key prop logic handles it.
         window.scrollTo({ top: 0, behavior: "smooth" });
      }
   };

   // Delete handler remains the same
   const handleDeleteExercise = (idToDelete: string) => {
      const updatedExercises = dailyExercises.filter(
         (entry) => entry.id !== idToDelete
      );
      setDailyExercises(updatedExercises);
      saveExercisesForDay(
         selectedDate,
         updatedExercises as unknown as import("../../Types/AppTypes").IExerciseEntry[]
      );
      // If deleting the item currently being edited, reset the form
      if (editingExercise?.id === idToDelete) {
         setEditingExercise(null);
         setFormKey(`new-${Date.now()}`);
      }
   };

   const handleCancelEdit = () => {
      setEditingExercise(null);
      // Also change the key on cancel to reset the form
      setFormKey(`new-${Date.now()}`);
   };

   // --- Styles ---
   // inputClasses is now passed down to the form
   const inputClasses =
      "block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 transition-colors duration-150 ease-in-out focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white";

   // Effect to handle clicking outside import modal
   useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
         if (
            calendarRef.current &&
            !calendarRef.current.contains(event.target as Node)
         ) {
            setShowCalendar(false);
         }
      }

      document.addEventListener("mousedown", handleClickOutside);
      return () => {
         document.removeEventListener("mousedown", handleClickOutside);
      };
   }, []); // Empty dependency array means this runs once on mount and cleans up on unmount

   // Effect to load exercises for import when importDate changes
   useEffect(() => {
      if (importDate) {
         const exercises = loadExercisesForDay(importDate);
         // Ensure correct parsing of loaded exercises for import
         const validatedImportExercises: IExerciseEntry[] = Array.isArray(
            exercises
         )
            ? exercises
                 .map((item: any) => {
                    if (item && typeof item.name === "string" && item.id) {
                       return {
                          ...item,
                          name: item.name,
                          id: item.id,
                          sets: Array.isArray(item.sets) ? item.sets : [],
                       };
                    }
                    return null;
                 })
                 .filter((item): item is IExerciseEntry => item !== null)
            : [];
         setImportExercises(validatedImportExercises);
         setSelectedToImport([]);
      } else {
         setImportExercises([]);
         setSelectedToImport([]);
      }
   }, [importDate]);

   // Handler for selecting date for import
   const handleDateSelect = (date: Date) => {
      // To prevent issues with timezones making the date appear as "yesterday"
      // we ensure the date is set to local midnight.
      const localDate = new Date(
         date.getFullYear(),
         date.getMonth(),
         date.getDate()
      );
      setImportDate(localDate);
   };

   // Handler for toggling exercise selection for import
   const handleToggleSelectExercise = (exerciseId: string) => {
      setSelectedToImport((prevSelected) =>
         prevSelected.includes(exerciseId)
            ? prevSelected.filter((id) => id !== exerciseId)
            : [...prevSelected, exerciseId]
      );
   };

   // Handler for importing selected exercises
   const handleImportSelected = () => {
      if (selectedToImport.length === 0) {
         alert(t("select_exercise_error"));
         return;
      }

      const exercisesToActuallyImport = importExercises.filter((ex) =>
         selectedToImport.includes(ex.id)
      );

      // Removed window.confirm, proceed directly with import
      let currentDailyExercises = [...dailyExercises];

      exercisesToActuallyImport.forEach((exerciseToImport) => {
         const existingIndex = currentDailyExercises.findIndex(
            (ex) =>
               ex.name.toLowerCase() === exerciseToImport.name.toLowerCase()
         );

         const newSets = exerciseToImport.sets.map((set) => ({
            ...set,
            id:
               Date.now().toString() +
               Math.random().toString(36).substring(2, 7), // New unique set IDs
         }));

         if (existingIndex >= 0) {
            // Exercise with the same name exists, update its sets
            currentDailyExercises[existingIndex] = {
               ...currentDailyExercises[existingIndex],
               sets: newSets,
               // Assuming 'details' would be preserved from existing entry or updated if necessary
            };
         } else {
            // Exercise does not exist, add it as a new entry
            currentDailyExercises.push({
               id:
                  Date.now().toString() +
                  Math.random().toString(36).substring(2, 7) +
                  "_imported", // New unique exercise ID
               name: exerciseToImport.name,
               sets: newSets,
               details: null, // Added missing 'details' property
            });
         }
      });

      setDailyExercises(currentDailyExercises);
      saveExercisesForDay(selectedDate, currentDailyExercises as any); // Type assertion might be needed depending on your save function
      setSelectedToImport([]); // Clear selection after import
      // Optionally, provide feedback like a toast message here
      setShowCalendar(false); // Close the modal after import
   };

   // Handler for importing all exercises from the selected date
   const handleImportAllFromDate = () => {
      if (importExercises.length === 0) {
         alert(t("no_exercises_import_error"));
         return;
      }

      // Removed window.confirm, proceed directly with import
      let currentDailyExercises = [...dailyExercises];

      importExercises.forEach((exerciseToImport) => {
         const existingIndex = currentDailyExercises.findIndex(
            (ex) =>
               ex.name.toLowerCase() === exerciseToImport.name.toLowerCase()
         );

         const newSets = exerciseToImport.sets.map((set) => ({
            ...set,
            id:
               Date.now().toString() +
               Math.random().toString(36).substring(2, 7), // New unique set IDs
         }));

         if (existingIndex >= 0) {
            // Exercise exists, update it
            currentDailyExercises[existingIndex] = {
               ...currentDailyExercises[existingIndex],
               sets: newSets,
               // Assuming 'details' would be preserved from existing entry or updated if necessary
            };
         } else {
            // Exercise does not exist, add it
            currentDailyExercises.push({
               id:
                  Date.now().toString() +
                  Math.random().toString(36).substring(2, 7) +
                  "_imported_all", // New exercise ID
               name: exerciseToImport.name,
               sets: newSets,
               details: null, // Added missing 'details' property
            });
         }
      });

      setDailyExercises(currentDailyExercises);
      saveExercisesForDay(selectedDate, currentDailyExercises as any);
      setSelectedToImport([]); // Clear selection as all are imported
      setShowCalendar(false); // Close modal after import
   };

   const getLocale = () => {
      const locales: Record<string, Locale> = {
         uk,
         de,
         ru,
         en: enUS,
      };
      return locales[language] || enUS;
   };

   const formattedDate = format(selectedDate, t("exercise_date_format"), {
      locale: getLocale(),
   });

   const formattedImportDate = importDate
      ? format(importDate, t("exercise_date_format"), { locale: getLocale() })
      : "";
   // Calculate max date for the import date picker (today)
   const maxImportDate = format(new Date(), "yyyy-MM-dd");

   return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200">
         {/* Heading */}
         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-green-dark mb-5 sm:mb-6 flex flex-wrap justify-between items-center gap-1 sm:gap-2 text-left">
            <span className="flex-shrink min-w-0">
               {editingExercise ? (
                  t("editing_exercise", { name: editingExercise.name })
               ) : (
                  <>
                     <span className="sm:hidden">
                        {t("exercise_page_title_short")}
                     </span>
                     <span className="hidden sm:inline">
                        {t("exercise_page_title", { date: formattedDate })}
                     </span>
                  </>
               )}
            </span>

            {!editingExercise && (
               <button
                  onClick={() => setShowCalendar((prev) => !prev)} // This toggles the Import Modal
                  className="text-brand-green hover:text-brand-green-dark p-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-brand-green/10 transition-all duration-150 ease-in-out flex items-center text-sm border border-transparent hover:border-brand-green/30"
                  aria-label={t("import")}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-5 w-5 sm:mr-1.5"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     strokeWidth="2"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                     />
                  </svg>
                  <span className="hidden sm:inline">{t("import")}</span>
               </button>
            )}
         </h2>

         {/* Exercise Form */}
         <ExerciseForm
            key={formKey} // Key for resetting the form
            onSubmit={(name: string, sets: any[]) => {
               // Convert IFormSet[] to IExerciseSet[] by ensuring notes property exists
               const exerciseSets: IExerciseSet[] = sets.map((set) => ({
                  ...set,
                  notes: set.notes || "", // Add empty string if notes is undefined
               }));
               handleFormSubmit(name, exerciseSets);
            }}
            initialData={editingExercise}
            onCancelEdit={editingExercise ? handleCancelEdit : undefined}
            inputClasses={inputClasses}
            suggestionSource={suggestionSource}
            maxSets={MAX_SETS} // Pass the MAX_SETS constant
         />

         {/* Use the new LoggedExerciseList component */}
         <LoggedExerciseList
            exercises={dailyExercises}
            onEditExercise={handleEditExercise}
            onDeleteExercise={handleDeleteExercise}
            isEditingAnyExercise={!!editingExercise}
         />

         {/* Use the new ImportModal component */}
         <ImportModal
            isOpen={showCalendar}
            onClose={() => setShowCalendar(false)}
            calendarRef={calendarRef as React.RefObject<HTMLDivElement>}
            inputClasses={inputClasses}
            importDate={importDate}
            onImportDateChange={handleDateSelect}
            maxDate={maxImportDate}
            importExercises={importExercises}
            selectedToImport={selectedToImport}
            onToggleSelectExercise={handleToggleSelectExercise}
            onImportSelected={handleImportSelected}
            onImportAllFromDate={handleImportAllFromDate}
            formattedImportDate={formattedImportDate}
         />
      </div>
   );
};

export type { IExerciseEntry };
