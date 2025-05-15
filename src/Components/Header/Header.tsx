import React from "react";
import { TypeAppMode } from "../../Types/AppTypes";

interface IHeaderProps {
   currentMode: TypeAppMode;
   onModeChange: (mode: TypeAppMode) => void;
}

export const Header: React.FC<IHeaderProps> = ({
   currentMode,
   onModeChange,
}) => {
   const getButtonClasses = (mode: TypeAppMode) => {
      // Base classes for all buttons
      const baseClasses =
         "px-4 py-2 rounded-md transition-colors duration-150 ease-in-out text-sm font-medium";

      if (mode === currentMode) {
         // Active button style
         return `${baseClasses} bg-brand-green text-white shadow-md`;
      } else {
         // Inactive button style - updated
         return `${baseClasses} bg-transparent hover:bg-brand-green-light/20 text-brand-text border border-brand-border hover:border-brand-green-light`;
      }
   };

   return (
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 p-4 pb-2 sm:pb-4 bg-white rounded-lg shadow-sm border border-brand-border">
         <h1 className="text-2xl font-bold text-brand-green-dark mb-2 sm:mb-0 text-center sm:text-left">
            Workout Tracker
         </h1>
         {/* Desktop Mode Toggle - Ensure 'hidden sm:flex' is present */}
         <div className="hidden sm:flex space-x-2">
            <button
               onClick={() => onModeChange("weight")}
               className={getButtonClasses("weight")}
            >
               Weight/Food
            </button>
            <button
               onClick={() => onModeChange("exercise")}
               className={getButtonClasses("exercise")}
            >
               Exercise
            </button>
         </div>
      </header>
   );
};
