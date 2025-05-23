import React from "react";
import { TypeAppMode } from "../../Types/AppTypes";
import { useAppContext } from "../../Context/AppContext"; 


interface IHeaderProps {
   currentMode: TypeAppMode;
   onModeChange: (mode: TypeAppMode) => void;
   onSettingsClick?: () => void;
   // Removed isSettingsOpen prop, will use context directly
}

export const Header: React.FC<IHeaderProps> = ({
   currentMode,
   onModeChange,
   onSettingsClick,
   // Removed isSettingsOpen from props
}) => {
   const { activePage } = useAppContext(); 

   const getButtonClasses = (mode: TypeAppMode) => {
      // Base classes for all buttons
      const baseClasses =
         "px-4 py-2 rounded-md transition-colors duration-150 ease-in-out text-sm font-medium";

      // Inactive button style - updated
      const inactiveClasses = `${baseClasses} bg-transparent hover:bg-brand-green-light/20 text-brand-text border border-brand-border hover:border-brand-green-light`;

      // If the active page is 'settings', always return the inactive state classes
      if (activePage === "settings") {
         return inactiveClasses; 
      }

      if (mode === currentMode) {
         // Active button style
         return `${baseClasses} bg-brand-green text-white shadow-md`;
      } else {
         // Inactive button style
         return inactiveClasses;
      }
   };

   // Define classes for the settings button based on activePage
   const settingsButtonClasses =
      activePage === "settings"
         ? "p-2 rounded-full text-brand-green transition-colors" // Active (green) style
         : "p-2 rounded-full text-gray-600 hover:text-brand-green hover:bg-gray-100 transition-colors"; // Inactive (gray) style

   return (
      // Removed flex-col to keep it flex-row on all screen sizes
      // Adjusted spacing and alignment to keep title left and buttons right
      <header className="flex justify-between items-center mb-6 p-4 py-2 sm:py-4 bg-white rounded-lg shadow-sm border border-brand-border">
         {/* Added max-w-[230px] to limit the title width */}
         {/* Changed text-2xl to text-xl for smaller font size */}
         <h1 className="text-lg font-bold text-brand-green-dark text-left max-w-[230px] truncate sm:text-xl">
            Workout Tracker
         </h1>
         {/* Container for mode toggle and settings button */}
         <div className="flex items-center space-x-2">
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

            {/* Settings button - always visible and right-aligned within its container */}
            <button
               onClick={onSettingsClick}
               className={settingsButtonClasses} // Use the dynamic classes here
               aria-label="Settings"
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
                     d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     strokeWidth={2}
                     d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
               </svg>
            </button>
         </div>
      </header>
   );
};
