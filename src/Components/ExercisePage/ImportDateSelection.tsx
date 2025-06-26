import React, { forwardRef, useState, useEffect } from "react";
import { subDays } from "date-fns";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { enGB, enUS } from "date-fns/locale"; // Import locales
import { loadUnitPreferences } from "../../Utils/LocalStorageUtils"; // Or unitPreferencesUtils.ts
import { useLanguage } from "../../Context/LanguageContext"; // Add this import

interface IImportDateSelectionProps {
   inputClasses: string;
   importDate: Date | null;
   onImportDateChange: (date: Date) => void;
   maxDate: string;
   defaultDate?: Date; // Added optional defaultDate prop
}

export const ImportDateSelection: React.FC<IImportDateSelectionProps> = ({
   inputClasses,
   importDate,
   onImportDateChange,
   maxDate,
   defaultDate,
}) => {
   const { t, getDateLocale } = useLanguage();
   const [_datepickerLocale, setDatepickerLocale] = useState(enGB); // Default to Monday start

   useEffect(() => {
      const preferences = loadUnitPreferences();
      setDatepickerLocale(
         preferences.calendarWeekStart === "sunday" ? enUS : enGB
      );
   }, []);

   const CustomInput = forwardRef(
      (
         {
            value,
            onClick,
            className,
         }: { value?: string; onClick?: () => void; className?: string },
         ref: React.Ref<HTMLButtonElement>
      ) => (
         <button
            className={`${className} relative`}
            onClick={onClick}
            ref={ref}
         >
            <input
               type="text"
               className={`${inputClasses} text-sm cursor-pointer`}
               value={value}
               readOnly
            />
            <svg
               xmlns="http://www.w3.org/2000/svg"
               className="h-5 w-5 mr-2 absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
               fill="none"
               viewBox="0 0 24 24"
               stroke="currentColor"
               strokeWidth={2}
            >
               <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
               />
            </svg>
         </button>
      )
   );

   return (
      <div className="mb-4 w-full">
         <label
            htmlFor="import-date-picker"
            className="block text-sm font-medium text-gray-700 mb-1.5"
         >
            {t("select_date_import")}
         </label>
         <DatePicker
            wrapperClassName="w-full"
            id="import-date-picker"
            className="min-w-[100%]"
            selected={importDate || defaultDate || null} // Use importDate, then defaultDate, then null
            onChange={(date: Date | null) =>
               onImportDateChange(date || new Date())
            }
            dateFormat="yyyy-MM-dd"
            maxDate={new Date(maxDate)} // Convert maxDate string to Date object
            customInput={<CustomInput className={inputClasses} />}
            locale={getDateLocale()}
            showPopperArrow={false}
            popperClassName="react-datepicker-popper-custom"
            calendarClassName="react-datepicker-calendar-custom"
            popperPlacement="bottom-start"
         />
         <div className="flex md:flex-wrap gap-2 mt-3 overflow-scroll md:overflow-hidden pb-2">
            {[1, 2, 3, 7, 14].map((days) => (
               <button
                  key={days}
                  onClick={() => onImportDateChange(subDays(new Date(), days))}
                  className="px-3 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-brand-green/10 text-brand-green-dark border border-gray-200 hover:border-brand-green rounded-md transition-all duration-150 ease-in-out whitespace-nowrap break-keep"
               >
                  {days === 1 ? t("yesterday") : t("days_ago", { days })}
               </button>
            ))}
         </div>
      </div>
   );
};
