import React, { useState, useEffect } from "react"; // Added useEffect
import {
   format,
   addMonths,
   subMonths,
   startOfMonth,
   endOfMonth,
   startOfWeek,
   endOfWeek,
   addDays,
   isSameMonth,
   isSameDay,
   isAfter,
   isSameMonth as isSameMonthFn,
} from "date-fns";
import { loadUnitPreferences } from "../../Utils/LocalStorageUtils"; // Or unitPreferencesUtils.ts
import { useLanguage } from "../../Context/LanguageContext";

interface ICalendarModalProps {
   selectedDate: Date;
   onDateSelect: (date: Date) => void;
   onClose: () => void;
   // calendarWeekStart: CalendarWeekStart; // Option 1: Pass as prop
}

export const CalendarModal: React.FC<ICalendarModalProps> = ({
   selectedDate,
   onDateSelect,
   onClose,
}) => {
   const { t } = useLanguage();
   const [currentMonth, setCurrentMonth] = useState(new Date(selectedDate));
   const today = new Date();
   // Option 2: Load preferences internally
   const [weekStartsOn, setWeekStartsOn] = useState<0 | 1>(1); // 0 for Sunday, 1 for Monday

   useEffect(() => {
      const preferences = loadUnitPreferences();
      setWeekStartsOn(preferences.calendarWeekStart === "sunday" ? 0 : 1);
   }, []);

   const prevMonth = () => {
      setCurrentMonth(subMonths(currentMonth, 1));
   };

   const nextMonth = () => {
      // Only allow going to next month if not already in current month
      if (!isSameMonthFn(currentMonth, today)) {
         setCurrentMonth(addMonths(currentMonth, 1));
      }
   };

   const isNextMonthDisabled = () => {
      // Check if current view is already showing the current month
      return isSameMonthFn(currentMonth, today);
   };

   const getMonthKey = (date: Date): `month_${number}` => {
      const monthNumber = format(date, "M");
      return `month_${Number(monthNumber)}` as `month_${number}`;
   };

   const renderHeader = () => {
      return (
         <div className="flex justify-between items-center mb-4">
            <button
               onClick={prevMonth}
               className="p-2 rounded-full hover:bg-gray-100"
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
               >
                  <path
                     fillRule="evenodd"
                     d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                     clipRule="evenodd"
                  />
               </svg>
            </button>
            <h2 className="text-lg font-bold text-gray-800">
               {t(getMonthKey(currentMonth) as any)}{" "}
               {format(currentMonth, "yyyy")}
            </h2>
            <button
               onClick={nextMonth}
               disabled={isNextMonthDisabled()}
               className={`p-2 rounded-full ${
                  isNextMonthDisabled()
                     ? "text-gray-300 cursor-not-allowed"
                     : "hover:bg-gray-100"
               }`}
            >
               <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
               >
                  <path
                     fillRule="evenodd"
                     d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                     clipRule="evenodd"
                  />
               </svg>
            </button>
         </div>
      );
   };

   const renderDays = () => {
      // Dynamically generate days based on weekStartsOn
      const dayNames =
         weekStartsOn === 1
            ? [
                 t("monday_short"),
                 t("tuesday_short"),
                 t("wednesday_short"),
                 t("thursday_short"),
                 t("friday_short"),
                 t("saturday_short"),
                 t("sunday_short"),
              ]
            : [
                 t("sunday_short"),
                 t("monday_short"),
                 t("tuesday_short"),
                 t("wednesday_short"),
                 t("thursday_short"),
                 t("friday_short"),
                 t("saturday_short"),
              ];

      return (
         <div className="grid grid-cols-7 mb-2">
            {dayNames.map((day, index) => (
               <div
                  key={index}
                  className="text-center text-sm font-medium text-gray-500 py-2"
               >
                  {day}
               </div>
            ))}
         </div>
      );
   };

   const renderCells = () => {
      const monthStart = startOfMonth(currentMonth);
      const monthEnd = endOfMonth(monthStart);
      // Use the state for weekStartsOn
      const startDate = startOfWeek(monthStart, { weekStartsOn: weekStartsOn });
      const endDate = endOfWeek(monthEnd, { weekStartsOn: weekStartsOn });

      const rows = [];
      let days = [];
      let day = startDate;

      while (day <= endDate) {
         for (let i = 0; i < 7; i++) {
            const cloneDay = day;
            const isFutureDate = isAfter(cloneDay, today);
            days.push(
               <div
                  key={day.toString()}
                  className={`py-3 px-1 text-center ${
                     !isSameMonth(day, monthStart)
                        ? "text-gray-300"
                        : isSameDay(day, selectedDate)
                        ? "bg-brand-green text-white rounded-lg"
                        : isFutureDate
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100 rounded-lg cursor-pointer"
                  }`}
                  onClick={() => {
                     if (!isFutureDate) {
                        onDateSelect(cloneDay);
                        onClose();
                     }
                  }}
               >
                  <span className="text-sm">{format(day, "d")}</span>
               </div>
            );
            day = addDays(day, 1);
         }
         rows.push(
            <div key={day.toString()} className="grid grid-cols-7">
               {days}
            </div>
         );
         days = [];
      }
      return <div className="mb-2">{rows}</div>;
   };

   return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
         <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
               <h2 className="text-xl font-bold text-gray-800">{t("select_date_title")}</h2>
               <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label={t("close_calendar")}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-6 w-6"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                     />
                  </svg>
               </button>
            </div>
            {renderHeader()}
            {renderDays()}
            {renderCells()}
            <div className="flex justify-end mt-4">
               <button
                  onClick={onClose}
                  className="px-4 py-2 bg-brand-green text-white rounded-lg hover:bg-brand-green-dark transition-colors"
               >
                  {t("cancel")}
               </button>
            </div>
         </div>
      </div>
   );
};

export default CalendarModal;
