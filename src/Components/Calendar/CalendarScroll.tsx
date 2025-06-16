import React, { useState, useRef, useEffect } from "react";
// Import startOfDay
import {
   format,
   addDays,
   subDays,
   startOfToday,
   isAfter,
   isSameDay,
   startOfDay,
} from "date-fns";
import CalendarModal from "./CalendarModal";
import "./CalendarScroll.css";
import { useLanguage } from "../../Context/LanguageContext";
import en from "../../locales/en.json";

interface ICalendarScrollProps {
   selectedDate: Date;
   onDateChange: (date: Date) => void;
}

export const CalendarScroll: React.FC<ICalendarScrollProps> = ({
   selectedDate,
   onDateChange,
}) => {
   const { t, getDateLocale } = useLanguage();
   const [showModal, setShowModal] = useState(false);
   const [dates, setDates] = useState<Date[]>([]);
   const scrollRef = useRef<HTMLDivElement>(null);
   const today = startOfToday(); // Already the start of today

   // Define how many days to show before and after the selected date
   const daysToShowBefore = 14;
   const daysToShowAfter = 7;

   // Generate dates for the calendar scroll, centered around the selectedDate
   useEffect(() => {
      const dateArray: Date[] = [];
      // Ensure selectedDate used for generation is also normalized
      const normalizedSelectedDate = startOfDay(selectedDate);
      for (let i = -daysToShowBefore; i <= daysToShowAfter; i++) {
         // Generate dates based on the normalized selected date
         dateArray.push(addDays(normalizedSelectedDate, i));
      }
      setDates(dateArray);
   }, [selectedDate]); // Dependency remains selectedDate prop

   // Scroll to selected date when component mounts or dates change
   useEffect(() => {
      if (scrollRef.current) {
         setTimeout(() => {
            const selectedElement = scrollRef.current?.querySelector(
               '[data-selected="true"]'
            );
            if (selectedElement) {
               selectedElement.scrollIntoView({
                  behavior: "smooth",
                  block: "nearest",
                  inline: "center",
               });
            }
         }, 0);
      }
   }, [selectedDate, dates]);

   const handlePrevious = () => {
      // Normalize the date before passing it up
      onDateChange(startOfDay(subDays(selectedDate, 1)));
   };

   const handleNext = () => {
      const currentNormalized = startOfDay(selectedDate);
      const nextDay = addDays(currentNormalized, 1);
      // Compare against today (which is already startOfDay)
      if (!isAfter(nextDay, today)) {
         // Normalize the date before passing it up
         onDateChange(nextDay);
      }
   };

   const isNextDisabled = () => {
      const currentNormalized = startOfDay(selectedDate);
      const nextDay = addDays(currentNormalized, 1);
      // Compare against today
      return isAfter(nextDay, today);
   };

   const handleDateClick = (date: Date) => {
      // Normalize the clicked date
      const dayToSelect = startOfDay(date);
      // Compare against today
      if (!isAfter(dayToSelect, today)) {
         onDateChange(dayToSelect); // Pass normalized date up
      }
   };

   const toggleModal = () => {
      setShowModal(!showModal);
   };

   const getDayShortName = (date: Date): keyof typeof en => {
      const day = format(date, "EEE").toLowerCase();
      const mapping: Record<string, keyof typeof en> = {
         mon: "monday_short" as keyof typeof en,
         tue: "tuesday_short" as keyof typeof en,
         wed: "wednesday_short" as keyof typeof en,
         thu: "thursday_short" as keyof typeof en,
         fri: "friday_short" as keyof typeof en,
         sat: "saturday_short" as keyof typeof en,
         sun: "sunday_short" as keyof typeof en,
      };
      return mapping[day];
   };

   return (
      <div className="w-full bg-white rounded-lg p-3 sm:p-4 shadow-sm mb-4">
         <div className="flex items-center justify-between">
            <button
               onClick={handlePrevious}
               className="text-gray-500 hover:text-brand-green p-1 xs:p-2"
               aria-label={t("previous_day")}
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

            <span className="block xs:hidden text-sm font-medium text-gray-700 mx-2 whitespace-nowrap">
               {format(startOfDay(selectedDate), "dd MMMM", {
                  locale: getDateLocale(),
               })}
            </span>

            <div
               ref={scrollRef}
               className="hidden xs:flex overflow-x-auto scrollbar-hide space-x-1 sm:space-x-2 py-2 flex-grow mx-1 sm:mx-2"
            >
               {dates.map((date) => {
                  // Normalize date for comparisons to ensure consistency
                  const currentDayNormalized = startOfDay(date);
                  const selectedDayNormalized = startOfDay(selectedDate);

                  // Determine if the date is in the future relative to today
                  const isFutureDate = isAfter(currentDayNormalized, today);
                  // Determine if the date is the selected date
                  const isCurrentlySelected = isSameDay(
                     currentDayNormalized,
                     selectedDayNormalized
                  );
                  // Determine if the date is today
                  const isCurrentToday = isSameDay(currentDayNormalized, today);

                  return (
                     <div
                        key={currentDayNormalized.toISOString()}
                        data-selected={isCurrentlySelected}
                        onClick={() =>
                           !isFutureDate &&
                           handleDateClick(currentDayNormalized)
                        }
                        className={`flex flex-col items-center justify-center min-w-[45px] xs:min-w-[50px] sm:min-w-[60px] py-1 sm:py-2 px-2 sm:px-3 rounded-lg transition-colors duration-300 ease-in-out ${
                           isFutureDate
                              ? "text-gray-300 cursor-not-allowed"
                              : isCurrentlySelected
                              ? "bg-brand-green text-white cursor-pointer"
                              : "hover:bg-gray-100 cursor-pointer"
                        }`}
                        role="button"
                        aria-label={t("select_date", {
                           date: format(currentDayNormalized, "PPP"),
                        })}
                        aria-pressed={isCurrentlySelected}
                     >
                        <span className="text-[11px] xs:text-xs sm:text-sm font-medium">
                           {t(getDayShortName(currentDayNormalized))}
                        </span>
                        <span className="text-sm xs:text-base sm:text-lg font-bold">
                           {format(date, "d")}
                        </span>
                        {isCurrentToday && (
                           <div
                              className={`h-1.5 w-1.5 mt-1 ${
                                 isCurrentlySelected
                                    ? "bg-white"
                                    : "bg-brand-green"
                              } rounded-full`}
                              aria-label={t("today_indicator")}
                           />
                        )}
                     </div>
                  );
               })}
            </div>

            <div className="flex items-center">
               <button
                  onClick={handleNext}
                  disabled={isNextDisabled()}
                  className={`p-1 xs:p-2 mr-1 xs:mr-0 ${
                     isNextDisabled()
                        ? "text-gray-300 cursor-not-allowed"
                        : "text-gray-500 hover:text-brand-green"
                  }`}
                  aria-label={t("next_day")}
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

               <button
                  onClick={toggleModal}
                  className="text-brand-green hover:text-brand-green-dark p-2"
                  aria-label={t("open_calendar")}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-6 w-6"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                     strokeWidth={2.3}
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                     />
                  </svg>
               </button>
            </div>
         </div>

         {showModal && (
            <CalendarModal
               // Pass normalized selected date to modal
               selectedDate={startOfDay(selectedDate)}
               onDateSelect={(date) => {
                  // Date from modal might have time, normalize before handling
                  const dayToSelect = startOfDay(date);
                  // Use the handler which includes the isAfter(today) check and normalization
                  handleDateClick(dayToSelect);
                  // Close modal after selection
                  toggleModal();
               }}
               onClose={toggleModal}
            />
         )}
      </div>
   );
};

export default CalendarScroll;
