import React from "react";
import { WeightUnit } from "../../Types/AppTypes"; // Import WeightUnit
import { useLanguage } from "../../Context/LanguageContext";



interface ISetInputRowProps {
   set: {
      id: string;
      reps: string | number;
      weight?: string | number;
      notes?: string;
   };
   index: number;
   inputClasses: string;
   isOnlySet: boolean;
   onSetChange: (
      id: string,
      field: "reps" | "weight" | "notes",
      value: string
   ) => void;
   onDeleteSet: (id: string) => void;
   currentWeightUnit: WeightUnit; // Add new prop for current weight unit
}

export const SetInputRow: React.FC<ISetInputRowProps> = ({
   set,
   index,
   inputClasses,
   isOnlySet,
   onSetChange,
   onDeleteSet,
   currentWeightUnit, // Destructure the new prop
}) => {
   const { t } = useLanguage();
   
   return (
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:space-x-3 py-3 px-3 rounded-md transition-colors hover:bg-gray-50/50 bg-white shadow-sm border border-gray-200">
         {/* Inputs */}
         <div className="flex flex-col sm:flex-row flex-1 space-y-2 sm:space-y-0 sm:space-x-3">
            {/* Reps */}
            <div className="flex-1 min-w-0">
               <label htmlFor={`reps-${set.id}`} className="sr-only">
                  {t('reps')}
               </label>
               <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  id={`reps-${set.id}`}
                  value={set.reps}
                  onChange={(e) => onSetChange(set.id, "reps", e.target.value)}
                  className={inputClasses}
                  placeholder={t('reps')}
                  required
                  maxLength={3}
               />
            </div>

            {/* Weight */}
            <div className="flex-1 min-w-0">
               <label htmlFor={`weight-${set.id}`} className="sr-only">
                  {t('weight')}
               </label>
               <input
                  type="text"
                  inputMode="decimal"
                  id={`weight-${set.id}`}
                  value={set.weight ?? ""}
                  onChange={(e) =>
                     onSetChange(set.id, "weight", e.target.value)
                  }
                  className={inputClasses}
                  placeholder={`${t('weight')} (${currentWeightUnit})`}
               />
            </div>

            {/* Notes */}
            <div className="flex-1 min-w-0 sm:flex-grow-[2]">
               <label htmlFor={`notes-${set.id}`} className="sr-only">
                  {t('notes')}
               </label>
               <input
                  type="text"
                  id={`notes-${set.id}`}
                  value={set.notes ?? ""}
                  onChange={(e) => onSetChange(set.id, "notes", e.target.value)}
                  className={`${inputClasses} w-full`}
                  placeholder={t('notes_placeholder')} 
                  maxLength={100}
               />
            </div>
         </div>

         {/* Mobile delete button - shown only on small screens and when more than 1 set */}
         {!isOnlySet && (
            <div className="block sm:hidden mt-3">
               <button
                  type="button"
                  onClick={() => onDeleteSet(set.id)}
                  className="w-full py-1.5 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition"
               >
                  {t('delete_set')}
               </button>
            </div>
         )}

         {/* Desktop delete button - right aligned */}
         {!isOnlySet && (
            <button
               type="button"
               onClick={() => onDeleteSet(set.id)}
               className="hidden sm:flex p-2.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition"
               aria-label={t('delete_set', { index: index + 1 })}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
               >
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M6 18L18 6M6 6l12 12"
                  />
               </svg>
            </button>
         )}
      </div>
   );
};
