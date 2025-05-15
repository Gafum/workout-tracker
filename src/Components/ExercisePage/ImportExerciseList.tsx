import React from "react";
import { IExerciseEntry } from "../../Pages/Exercise/Exercise"; // Adjust path if IExerciseEntry is moved

interface IImportExerciseListProps {
   importExercises: IExerciseEntry[];
   selectedToImport: string[];
   onToggleSelectExercise: (exerciseId: string) => void;
   formattedImportDate: string;
   onImportAllFromDate: () => void;
}

export const ImportExerciseList: React.FC<IImportExerciseListProps> = ({
   importExercises,
   selectedToImport,
   onToggleSelectExercise,
   formattedImportDate,
   onImportAllFromDate,
}) => {
   if (importExercises.length === 0) {
      return (
         <p className="text-sm text-gray-500 italic py-4 text-center">
            No exercises logged on this date.
         </p>
      );
   }

   return (
      <>
         <div className="flex flex-wrap justify-between items-center mb-3 gap-2">
            <h4 className="text-md sm:text-lg font-semibold text-brand-text">
               Available from {formattedImportDate}:
            </h4>
            {importExercises.length > 0 && (
               <button
                  onClick={onImportAllFromDate}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-brand-green/10 text-brand-green-dark border border-gray-200 hover:border-brand-green rounded-md transition-all duration-150 ease-in-out shadow-sm"
               >
                  Import All ({importExercises.length})
               </button>
            )}
         </div>
         <div className="space-y-2 pb-2">
            {importExercises.map((exercise) => {
               const isSelected = selectedToImport.includes(exercise.id);
               return (
                  <div
                     key={exercise.id}
                     onClick={() => onToggleSelectExercise(exercise.id)}
                     className={`p-3 sm:p-4 border rounded-lg cursor-pointer transition-all duration-150 ease-in-out flex items-center justify-between
                        ${isSelected
                           ? "bg-brand-green/10 border-brand-green shadow-md ring-1 ring-brand-green"
                           : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                     role="checkbox"
                     aria-checked={isSelected}
                     tabIndex={0}
                     onKeyDown={(e) => { if (e.key === ' ' || e.key === 'Enter') onToggleSelectExercise(exercise.id); }}
                  >
                     <div>
                        <div className={`font-medium ${isSelected ? 'text-brand-green-dark' : 'text-brand-text'}`}>
                           {exercise.name}
                        </div>
                        <div className={`text-xs sm:text-sm ${isSelected ? 'text-brand-green' : 'text-gray-600'} mt-0.5`}>
                           {exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}
                        </div>
                     </div>
                     <div className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full border-2 flex items-center justify-center transition-all duration-150
                        ${isSelected ? 'bg-brand-green border-brand-green-dark' : 'border-gray-300 bg-white'}`}>
                        {isSelected && (
                           <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 sm:h-4 sm:w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                           </svg>
                        )}
                     </div>
                  </div>
               );
            })}
         </div>
      </>
   );
};