import React from "react";
import { useWeightFood } from "../../Hooks/useWeightFood";
import { getBmiColor } from "../../Utils/metricDisplayUtils";
import WeightChart from '../../Components/WeightChart/WeightChart';

interface IWeightFoodProps {
   selectedDate: Date;
}

export const WeightFood: React.FC<IWeightFoodProps> = ({ selectedDate }) => {
   const {
      morningWeight, setMorningWeight,
      eveningWeight, setEveningWeight,
      heightInput, setHeightInput,
      age, setAge,
      bmi, bmiCategory, bmr,
      message, unitPreferences,
      handleSaveMetrics,
   } = useWeightFood(selectedDate);

   const inputClasses =
      "mt-1 block w-full px-3 py-2 bg-white border border-brand-border rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";
   const cardClasses = "p-4 bg-gray-50 rounded-lg shadow-sm border border-brand-border";

   return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-brand-border min-h-[300px]">
         <h2 className="text-xl font-semibold text-brand-green-dark mb-6">
            Daily Metrics & Log
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Inputs Column */} 
            <div className="space-y-4">
               <div>
                  <label htmlFor="morningWeight" className="block text-sm font-medium text-gray-700">
                     Morning Weight ({unitPreferences.weight.toUpperCase()})
                  </label>
                  <input type="number" id="morningWeight" value={morningWeight} onChange={(e) => setMorningWeight(e.target.value)} onBlur={handleSaveMetrics} className={inputClasses} placeholder={`e.g., ${unitPreferences.weight === 'kg' ? '70.5' : '155.5'}`} step="0.1" min="0" />
               </div>

               <div>
                  <label htmlFor="eveningWeight" className="block text-sm font-medium text-gray-700">
                     Evening Weight ({unitPreferences.weight.toUpperCase()})
                  </label>
                  <input type="number" id="eveningWeight" value={eveningWeight} onChange={(e) => setEveningWeight(e.target.value)} onBlur={handleSaveMetrics} className={inputClasses} placeholder={`e.g., ${unitPreferences.weight === 'kg' ? '71.2' : '157.0'}`} step="0.1" min="0" />
               </div>

               <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                     Height ({unitPreferences.height === 'ft/in' ? 'IN' : unitPreferences.height.toUpperCase()})
                  </label>
                  <input 
                     type="number" 
                     id="height" 
                     value={heightInput} // Use heightInput
                     onChange={(e) => setHeightInput(e.target.value)} // Use setHeightInput
                     onBlur={handleSaveMetrics} 
                     className={inputClasses} 
                     placeholder={`e.g., ${unitPreferences.height === 'cm' ? '175' : '69'}`}
                     step={unitPreferences.height === 'cm' ? "1" : "0.1"} 
                     min="0" 
                  />
                  {unitPreferences.height === 'ft/in' && <p className="text-xs text-gray-500 mt-1">Enter total height in inches.</p>}
               </div>

               <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                     Age (Years)
                  </label>
                  <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} onBlur={handleSaveMetrics} className={inputClasses} placeholder="e.g., 25" min="0" />
               </div>
            </div>

            {/* Analytics Column */} 
            <div className="space-y-4">
               <div className={cardClasses}>
                  <h3 className="text-lg font-medium text-brand-green-dark mb-2">BMI</h3>
                  {bmi !== null ? (
                     <p className={`text-2xl font-bold ${getBmiColor(bmiCategory)}`}>
                        {bmi} <span className="text-sm font-normal">({bmiCategory})</span>
                     </p>
                  ) : (
                     <p className="text-gray-500">Enter weight & height.</p>
                  )}
               </div>

               <div className={cardClasses}>
                  <h3 className="text-lg font-medium text-brand-green-dark mb-2">Est. Resting Calories</h3>
                  {bmr !== null ? (
                     <p className="text-2xl font-bold text-gray-700">
                        {bmr} <span className="text-sm font-normal">kcal/day (BMR)</span>
                     </p>
                  ) : (
                     <p className="text-gray-500">Enter weight, height, & age.</p>
                  )}
               </div>
            </div>
         </div>

         {message && <p className="text-sm text-green-600 mb-4 text-center">{message}</p>}

         {/* Add the WeightChart component */}
         <WeightChart 
             unitPreferences={unitPreferences}
             currentMorningWeight={morningWeight?.toString() ?? null}
             currentEveningWeight={eveningWeight?.toString() ?? null}
             selectedDate={selectedDate}
         />

         {/* Food Log Section - Placeholder - To be implemented separately */}
         {/* <div className={cardClasses}> ... </div> */}
      </div>
   );
};
