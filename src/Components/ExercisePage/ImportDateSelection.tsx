import React from "react";
import { format, subDays } from "date-fns";

interface IImportDateSelectionProps {
   inputClasses: string;
   importDate: Date | null;
   onImportDateChange: (date: Date) => void;
   maxDate: string;
}

export const ImportDateSelection: React.FC<IImportDateSelectionProps> = ({
   inputClasses,
   importDate,
   onImportDateChange,
   maxDate,
}) => {
   const handleDateInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Dates from input type="date" are in 'YYYY-MM-DD' format and represent local time.
      // new Date('YYYY-MM-DD') can have timezone issues (parses as UTC midnight).
      // To ensure it's treated as local, split and construct.
      const [year, month, day] = e.target.value.split('-').map(Number);
      onImportDateChange(new Date(year, month - 1, day));
   };

   return (
      <div className="mb-4">
         <label htmlFor="import-date-picker" className="block text-sm font-medium text-gray-700 mb-1.5">
            Select Date to Import From:
         </label>
         <input
            id="import-date-picker"
            type="date"
            className={`${inputClasses} text-sm`}
            onChange={handleDateInputChange}
            max={maxDate}
            value={importDate ? format(importDate, "yyyy-MM-dd") : ""}
         />
         <div className="flex flex-wrap gap-2 mt-3">
            {[1, 2, 3, 7, 14].map(days => (
               <button
                  key={days}
                  onClick={() => onImportDateChange(subDays(new Date(), days))}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-brand-green/10 text-brand-green-dark border border-gray-200 hover:border-brand-green rounded-md transition-all duration-150 ease-in-out"
               >
                  {days === 1 ? 'Yesterday' : `${days} days ago`}
               </button>
            ))}
         </div>
      </div>
   );
};