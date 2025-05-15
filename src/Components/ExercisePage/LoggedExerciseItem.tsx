import React from "react";
import { IExerciseEntry } from "../../Pages/Exercise/Exercise"; // Adjust path if IExerciseEntry is moved

interface ILoggedExerciseItemProps {
   exercise: IExerciseEntry;
   onEdit: (id: string) => void;
   onDelete: (id: string) => void;
}

export const LoggedExerciseItem: React.FC<ILoggedExerciseItemProps> = ({
   exercise,
   onEdit,
   onDelete,
}) => {
   // Common button classes
   const buttonBaseClasses = "p-1.5 sm:p-2 rounded-md transition-colors duration-150 ease-in-out";
   const editButtonClasses = `${buttonBaseClasses} text-blue-600 hover:text-blue-800 hover:bg-blue-100`;
   const deleteButtonClasses = `${buttonBaseClasses} text-red-500 hover:text-red-700 hover:bg-red-100`;
   const svgIconClasses = "h-4 w-4 sm:h-5 sm:w-5";

   const EditButton = () => (
      <button
         onClick={() => onEdit(exercise.id)}
         className={editButtonClasses}
         aria-label={`Edit ${exercise.name}`}
      >
         <svg xmlns="http://www.w3.org/2000/svg" className={svgIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
         </svg>
      </button>
   );

   const DeleteButton = () => (
      <button
         onClick={() => onDelete(exercise.id)}
         className={deleteButtonClasses}
         aria-label={`Delete ${exercise.name}`}
      >
         <svg xmlns="http://www.w3.org/2000/svg" className={svgIconClasses} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
         </svg>
      </button>
   );

   return (
      <div
         key={exercise.id}
         className="group bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm hover:shadow-md transition-all duration-150 ease-in-out"
      >
         {/* Main container for content */}
         <div className="flex flex-col">
            {/* TOP ROW: Headline + Desktop Buttons (visible sm and up) */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2">
               <h4 className="text-md sm:text-lg font-semibold text-brand-green-dark break-words mb-2 sm:mb-0 flex-grow">
                  {exercise.name}
               </h4>
               {/* Desktop Buttons Container */}
               <div
                  className="hidden sm:flex items-center self-end sm:self-start space-x-2 sm:space-x-3 flex-shrink-0 
                             opacity-0 group-hover:opacity-100 focus-within:opacity-100 
                             transition-opacity duration-150 ease-in-out"
               >
                  <EditButton />
                  <DeleteButton />
               </div>
            </div>

            {/* Sets display - remains below the headline and buttons */}
            <div className="text-xs sm:text-sm text-gray-700 space-y-2">
               {exercise.sets.map((set, index) => (
                  <div
                     key={set.id}
                     className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 border border-gray-100 rounded-md bg-gray-50/50"
                  >
                     <div className="flex justify-between sm:justify-start items-center w-full sm:w-auto">
                        <span className="font-semibold text-brand-text-light mr-2 sm:mr-3">
                           Set {index + 1}:
                        </span>
                        <span className="font-medium text-gray-800">
                           {set.reps} reps
                        </span>
                     </div>
                     {(set.weight || Number(set.weight) === 0) && (
                        <span className="text-gray-600 mt-1 sm:mt-0 sm:ml-3 text-right sm:text-left">
                           {set.weight} kg
                        </span>
                     )}
                  </div>
               ))}
            </div>

            {/* MOBILE BUTTONS (visible on mobile, hidden sm and up, at the very bottom) */}
            <div className="flex sm:hidden items-center justify-center space-x-3 mt-4"> {/* Increased space to space-x-3 and margin to mt-4 */}
               <EditButton />
               <DeleteButton />
            </div>
         </div>
      </div>
   );
};
