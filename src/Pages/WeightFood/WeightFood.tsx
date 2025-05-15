import React, { useState, useEffect } from "react";
import {
   loadWeightForDay,
   saveWeightForDay,
} from "../../Utils/LocalStorageUtils";
import { IDailyWeight, IFoodEntry } from "../../Types/AppTypes";

interface IWeightFoodProps {
   selectedDate: Date; // Receive selected date from App
}

export const WeightFood: React.FC<IWeightFoodProps> = ({ selectedDate }) => {
   const [morningWeight, setMorningWeight] = useState<string | number>("");
   const [eveningWeight, setEveningWeight] = useState<string | number>("");
   const [message, setMessage] = useState<string | null>(null);
   const [foodEntries, setFoodEntries] = useState<IFoodEntry[]>([]);
   const [, setFoodError] = useState<string | null>(null);

   // Load weight data when the selected date changes
   useEffect(() => {
      const loadedWeightData = loadWeightForDay(selectedDate);
      
      if (loadedWeightData && (loadedWeightData.morningWeight !== null || loadedWeightData.eveningWeight !== null)) {
         // If we have data for the selected date, use it
         setMorningWeight(loadedWeightData.morningWeight ?? "");
         setEveningWeight(loadedWeightData.eveningWeight ?? "");
      } else {
         // If no data for selected date, try to find most recent data
         const recentWeight = findMostRecentWeightData();
         if (recentWeight) {
            setMorningWeight(recentWeight.morningWeight ?? "");
            setEveningWeight(recentWeight.eveningWeight ?? "");
         } else {
            // No recent data found, use empty values
            setMorningWeight("");
            setEveningWeight("");
         }
      }
      
      setFoodEntries(
         (loadedWeightData as IDailyWeight & { foodEntries?: IFoodEntry[] })
            ?.foodEntries ?? []
      );
      setMessage(null);
      setFoodError(null);
   }, [selectedDate]);

   // Function to find the most recent weight data
   const findMostRecentWeightData = (): { morningWeight: number | null, eveningWeight: number | null } | null => {
      // Start from today and go backwards
      const today = new Date();
      const startDate = new Date(today);
      startDate.setFullYear(today.getFullYear() - 1); // Look back up to 1 year
      
      let currentDate = new Date(today);
      
      while (currentDate >= startDate) {
         const data = loadWeightForDay(currentDate);
         if (data && (data.morningWeight !== null || data.eveningWeight !== null)) {
            return data;
         }
         // Move to previous day
         currentDate.setDate(currentDate.getDate() - 1);
      }
      
      return null; // No data found in the past year
   };

   // Function to handle saving data
   const handleSaveWeight = () => {
      const morningW = morningWeight === "" ? null : Number(morningWeight);
      const eveningW = eveningWeight === "" ? null : Number(eveningWeight);

      // Basic validation (optional, can add more specific checks)
      if (morningWeight !== "" && (isNaN(morningW!) || morningW! <= 0)) {
         setMessage("Morning weight must be a positive number.");
         return;
      }
      if (eveningWeight !== "" && (isNaN(eveningW!) || eveningW! <= 0)) {
         setMessage("Evening weight must be a positive number.");
         return;
      }

      const weightDataToSave = {
         morningWeight: morningW,
         eveningWeight: eveningW,
         foodEntries: foodEntries, // Include food entries in saved data
      };
      saveWeightForDay(selectedDate, weightDataToSave);
      setMessage("Weight data saved successfully!");
      // Clear message after a few seconds
      setTimeout(() => setMessage(null), 3000);
   };

   // Debounce saving or save on blur/button click
   // Using onBlur for simplicity here
   const handleBlur = () => {
      handleSaveWeight();
   };

   // Handle adding a food entry

   // Handle deleting a food entry

   const inputClasses =
      "mt-1 block w-full px-3 py-2 bg-white border border-brand-border rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";

   return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-brand-border min-h-[300px]">
         <h2 className="text-xl font-semibold text-brand-green-dark mb-4">
            Weight Log
         </h2>

         <div className="space-y-4">
            {/* Morning Weight Input */}
            <div>
               <label
                  htmlFor="morningWeight"
                  className="block text-sm font-medium text-gray-700"
               >
                  Morning Weight (kg/lbs)
               </label>
               <input
                  type="number"
                  id="morningWeight"
                  value={morningWeight}
                  onChange={(e) => setMorningWeight(e.target.value)}
                  onBlur={handleBlur} // Save when focus leaves the input
                  className={inputClasses}
                  placeholder="e.g., 70.5"
                  step="0.1" // Allow decimals
                  min="0"
               />
            </div>

            {/* Evening Weight Input */}
            <div>
               <label
                  htmlFor="eveningWeight"
                  className="block text-sm font-medium text-gray-700"
               >
                  Evening Weight (kg/lbs)
               </label>
               <input
                  type="number"
                  id="eveningWeight"
                  value={eveningWeight}
                  onChange={(e) => setEveningWeight(e.target.value)}
                  onBlur={handleBlur} // Save when focus leaves the input
                  className={inputClasses}
                  placeholder="e.g., 71.2"
                  step="0.1"
                  min="0"
               />
            </div>

            {/* Save Confirmation Message */}
            {message && <p className="text-sm text-green-600">{message}</p>}

            {/* Food Log Section */}
            {/* <h2>Here Should be the component for Food Section</h2> */}
         </div>
      </div>
   );
};
