import { useState } from "react";
import { Header } from "./Components/Header/Header";
import { CalendarScroll } from "./Components/Calendar/CalendarScroll";
import { WeightFood } from "./Pages/WeightFood/WeightFood";
import { Exercise } from "./Pages/Exercise/Exercise";
import { Settings } from "./Pages/Settings/Settings";
import { Plans } from "./Pages/Plans/Plans";
import { AppProvider, useAppContext } from "./Context/AppContext";
import { TypeAppMode } from "./Types/AppTypes";
import { MobileNav } from "./Components/MobileNav/MobileNav";
import { ActivePlanWidget } from "./Components/ActivePlanWidget";
import { saveExercisesForDay } from "./Utils/LocalStorageUtils";
import { POPULAR_EXERCISES } from "./locales/PopularExercises/PopularExercises";
import { useLanguage } from "./Context/LanguageContext";
import "./index.css";
import { LanguageProvider } from "./Context/LanguageContext";

// Main App component content, wrapped in AppProvider
const AppContent = () => {
   const {
      activePage,
      setActivePage,
      activePlan,
      activePlanDayIndex,
      setActivePlanDayIndex,
   } = useAppContext();
   const { language } = useLanguage();
   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

   const exerciseNames =
      POPULAR_EXERCISES[language as keyof typeof POPULAR_EXERCISES] ||
      POPULAR_EXERCISES.en;

   // Function to handle date changes from CalendarScroll
   const handleDateChange = (date: Date) => {
      setSelectedDate(date);
   };

   // Function to handle mode change from Header (Exercise/Weight)
   const handleModeChange = (mode: TypeAppMode) => {
      if (mode === "exercise" || mode === "weight") {
         setActivePage(mode);
      }
   };

   // Function to handle settings button click
   const handleSettingsClick = () => {
      setActivePage("settings");
   };

   const handlePlansClick = () => {
      setActivePage("plans");
   };

   const handleStartWorkout = () => {
      if (!activePlan) {
         setActivePage("plans");
         return;
      }

      const today = new Date();
      setSelectedDate(today);
      const selectedDay =
         activePlan.days[activePlanDayIndex] || activePlan.days[0];

      const planExerciseEntries = selectedDay.exercises.map((exercise) => ({
         id:
            `${Date.now()}-${exercise.exerciseIndex}-${Math.random()
               .toString(36)
               .slice(2, 6)}`,
         name:
            exerciseNames[exercise.exerciseIndex] ||
            `Exercise ${exercise.exerciseIndex}`,
         details: null,
         sets: Array.from({ length: exercise.sets }, (_, index) => ({
            id: `${Date.now()}-${exercise.exerciseIndex}-${index}`,
            reps: exercise.reps,
            weight: exercise.defaultWeight ?? "",
            notes: "",
         })),
      }));

      saveExercisesForDay(today, planExerciseEntries as any);
      setActivePage("exercise");
   };

   const handleSelectDay = (dayIndex: number) => {
      setActivePlanDayIndex(dayIndex);
   };

   return (
      // Add pb-16 (padding-bottom: 4rem, height of MobileNav) to prevent content overlap on mobile
      // Add sm:pb-0 to remove the padding on larger screens
      <div className="container mx-auto p-4 max-w-screen-md min-h-screen flex flex-col pb-16 sm:pb-0">
         <Header
            onModeChange={handleModeChange}
            onSettingsClick={handleSettingsClick}
            onPlansClick={handlePlansClick}
         />

         {/* CalendarScroll is only relevant for Exercise and Weight pages */}
         {activePage !== "settings" && activePage !== "plans" && (
            <CalendarScroll
               selectedDate={selectedDate}
               onDateChange={handleDateChange}
            />
         )}

         {activePage !== "settings" && activePage !== "plans" && (
            <ActivePlanWidget
               activePlan={activePlan}
               activeDayIndex={activePlanDayIndex}
               onOpenPlanCatalog={handlePlansClick}
               onSelectDay={handleSelectDay}
               onStartWorkout={handleStartWorkout}
            />
         )}

         <main className="flex-grow">
            {activePage === "weight" && <WeightFood selectedDate={selectedDate} />}
            {activePage === "exercise" && <Exercise selectedDate={selectedDate} />}
            {activePage === "settings" && <Settings />}
            {activePage === "plans" && <Plans />}
         </main>

         {/* Mobile Navigation - shown only on small screens */}
         {/* Removed the condition activePage !== 'settings' */}
         <div className="sm:hidden">
            {/* Wrapper div to apply sm:hidden */}
            <MobileNav
               onModeChange={handleModeChange}
               onPlansClick={handlePlansClick}
            />
         </div>

         {/* Footer - always present for spacing, text visible on sm+ */}
         <footer className="text-center text-sm mt-8 py-4 border-t border-brand-border">
            <span className="text-gray-500 invisible sm:visible">
               Workout Tracker App
            </span>{" "}
            {/* Text invisible on mobile, visible on sm+ */}
         </footer>
      </div>
   );
};

// Wrap the main AppContent with the AppProvider
export const App = () => {
   return (
      <LanguageProvider>
         <AppProvider>
            <AppContent />
         </AppProvider>
      </LanguageProvider>
   );
};

export default App; // Keep default export for Vite HMR
