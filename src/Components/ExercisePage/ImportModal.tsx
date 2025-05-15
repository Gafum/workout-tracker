import React from "react";
import { ImportDateSelection } from "./ImportDateSelection";
import { ImportExerciseList } from "./ImportExerciseList";
import { IExerciseEntry } from "../../Pages/Exercise/Exercise"; // Adjust path if IExerciseEntry is moved

interface IImportModalProps {
   isOpen: boolean;
   onClose: () => void;
   calendarRef: React.RefObject<HTMLDivElement>;
   inputClasses: string;
   importDate: Date | null;
   onImportDateChange: (date: Date) => void;
   maxDate: string;
   importExercises: IExerciseEntry[];
   selectedToImport: string[];
   onToggleSelectExercise: (exerciseId: string) => void;
   onImportSelected: () => void;
   onImportAllFromDate: () => void;
   formattedImportDate: string;
}

export const ImportModal: React.FC<IImportModalProps> = ({
   isOpen,
   onClose,
   calendarRef,
   inputClasses,
   importDate,
   onImportDateChange,
   maxDate,
   importExercises,
   selectedToImport,
   onToggleSelectExercise,
   onImportSelected,
   onImportAllFromDate,
   formattedImportDate,
}) => {
   if (!isOpen) return null;

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 sm:p-4">
         <div
            ref={calendarRef}
            className="bg-white rounded-xl shadow-2xl p-4 sm:p-6 max-w-lg w-full flex flex-col max-h-[90vh] sm:max-h-[85vh]"
         >
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-gray-200">
               <h3 className="text-lg sm:text-xl font-semibold text-brand-green-dark">
                  Import Exercises
               </h3>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-brand-red p-1.5 rounded-full hover:bg-gray-100 transition-colors"
                  aria-label="Close import modal"
               >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                     <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
               </button>
            </div>

            <ImportDateSelection
               inputClasses={inputClasses}
               importDate={importDate}
               onImportDateChange={onImportDateChange}
               maxDate={maxDate}
            />

            {importDate && (
               <div className="flex-grow overflow-y-auto mb-4 border-t border-gray-200 pt-4 -mx-4 sm:-mx-6 px-4 sm:px-6">
                  <ImportExerciseList
                     importExercises={importExercises}
                     selectedToImport={selectedToImport}
                     onToggleSelectExercise={onToggleSelectExercise}
                     formattedImportDate={formattedImportDate}
                     onImportAllFromDate={onImportAllFromDate}
                  />
               </div>
            )}
            {!importDate && (
                 <div className="flex-grow flex items-center justify-center mb-4 border-t border-gray-200 pt-4">
                    <p className="text-sm text-gray-500 italic">Please select a date to see available exercises.</p>
                 </div>
            )}

            <div className="mt-auto pt-4 border-t border-gray-200 flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
               <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-light transition-colors"
               >
                  Cancel
               </button>
               <button
                  onClick={onImportSelected}
                  disabled={selectedToImport.length === 0 || !importDate}
                  className="w-full sm:w-auto px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green-dark disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
               >
                  Import Selected ({selectedToImport.length})
               </button>
            </div>
         </div>
      </div>
   );
};