import { useState, useEffect, useCallback } from "react";
import {
   loadWeightForDay,
   saveWeightForDay,
   loadUnitPreferences,
} from "../Utils/LocalStorageUtils"; 
import { IDailyWeightFood, IFoodEntry, IUnitPreferences, BmiCategory, HeightUnit } from "../Types/AppTypes";
import { getBmiCategory } from "../Utils/metricDisplayUtils";

// Helper for height conversion
const convertHeightToCm = (heightValue: string | number, unit: HeightUnit): number => {
   const numHeight = Number(heightValue);
   if (isNaN(numHeight) || numHeight <= 0) return 0;
   if (unit === 'ft/in') { // Assuming 'ft/in' means value is stored as total inches
      return numHeight * 2.54;
   }
   return numHeight; // Already cm
};

const convertCmToDisplayHeight = (heightCm: number, unit: HeightUnit): string => {
   if (heightCm <= 0) return "";
   if (unit === 'ft/in') {
      return (heightCm / 2.54).toFixed(1); // Convert cm to inches
   }
   return heightCm.toFixed(0); // cm, typically whole number
};

export const useWeightFood = (selectedDate: Date) => {
   const [morningWeight, setMorningWeight] = useState<string | number>("");
   const [eveningWeight, setEveningWeight] = useState<string | number>("");
   // Store height as string for input, but ensure it's treated consistently with units
   const [heightInput, setHeightInput] = useState<string>(""); 
   const [age, setAge] = useState<string | number>("25");

   const [bmi, setBmi] = useState<number | null>(null);
   const [bmiCategory, setBmiCategory] = useState<BmiCategory>('N/A');
   const [bmr, setBmr] = useState<number | null>(null);

   const [message, setMessage] = useState<string | null>(null);
   const [foodEntries, setFoodEntries] = useState<IFoodEntry[]>([]); 
   const [unitPreferences, setUnitPreferences] = useState<IUnitPreferences>(loadUnitPreferences());

   const calculateMetrics = useCallback(() => {
      const currentWeightKg = unitPreferences.weight === 'lbs' 
         ? (Number(morningWeight) || Number(eveningWeight) || 0) * 0.453592 
         : (Number(morningWeight) || Number(eveningWeight) || 0);
      
      // Convert heightInput to cm for calculations based on current unit preference
      const currentHeightCm = convertHeightToCm(heightInput, unitPreferences.height);
      const currentHeightM = currentHeightCm / 100;
      const currentAgeVal = Number(age) || 25;

      if (currentWeightKg > 0 && currentHeightM > 0) {
         const newBmi = currentWeightKg / (currentHeightM * currentHeightM);
         setBmi(parseFloat(newBmi.toFixed(1)));
         setBmiCategory(getBmiCategory(newBmi));
      } else {
         setBmi(null);
         setBmiCategory('N/A');
      }

      if (currentWeightKg > 0 && currentHeightCm > 0 && currentAgeVal > 0) {
         const newBmr = (10 * currentWeightKg) + (6.25 * currentHeightCm) - (5 * currentAgeVal) + 5;
         setBmr(parseFloat(newBmr.toFixed(0)));
      } else {
         setBmr(null);
      }
   }, [morningWeight, eveningWeight, heightInput, age, unitPreferences]);

   useEffect(() => {
      calculateMetrics();
   }, [calculateMetrics]);

   const findMostRecentMetricsData = useCallback((): IDailyWeightFood | null => {
      // ... (implementation should be fine, ensure it returns height in a consistent base unit if possible)
      // For now, assume it returns height as it was saved (e.g., in cm or as entered with its unit)
      // If it returns height in cm, then conversion to display unit is needed.
      // If it returns height as entered, then unit is also needed from that day's preferences (complex).
      // Let's assume for now that IDailyWeightFood stores height in a base unit like cm.
      // OR, that it stores the raw value and we rely on the unit preference of *that day*.
      // The simplest is to always store height in cm in IDailyWeightFood.height.
      const today = new Date();
      let currentDate = new Date(today);
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      while (currentDate >= oneYearAgo) {
         const data = loadWeightForDay(currentDate) as IDailyWeightFood | null;
         // Check if height is explicitly not null or undefined
         if (data && (data.morningWeight !== undefined || data.eveningWeight !== undefined || data.height !== null && data.height !== undefined)) {
            return data;
         }
         currentDate.setDate(currentDate.getDate() - 1);
      }
      return null;
   }, []);

   const loadDataForSelectedDate = useCallback(() => {
      const loadedData = loadWeightForDay(selectedDate) as IDailyWeightFood | null;
      const currentPrefs = loadUnitPreferences(); // Load current preferences for display conversion
      setUnitPreferences(currentPrefs);

      if (loadedData) {
         setMorningWeight(loadedData.morningWeight ?? "");
         setEveningWeight(loadedData.eveningWeight ?? "");
         // Assuming loadedData.height is stored in CM
         setHeightInput(loadedData.height !== null && loadedData.height !== undefined 
            ? convertCmToDisplayHeight(loadedData.height, currentPrefs.height) 
            : "");
         setAge(loadedData.age ?? "25");
         setFoodEntries(loadedData.foodEntries ?? []);
      } else {
         const recentData = findMostRecentMetricsData();
         if (recentData) {
            setMorningWeight(recentData.morningWeight ?? "");
            setEveningWeight(recentData.eveningWeight ?? "");
            // Assuming recentData.height is stored in CM
            setHeightInput(recentData.height !== null && recentData.height !== undefined 
               ? convertCmToDisplayHeight(recentData.height, currentPrefs.height) 
               : "");
            setAge(recentData.age ?? "25");
            setFoodEntries([]); 
         } else {
            setMorningWeight("");
            setEveningWeight("");
            setHeightInput("");
            setAge("25");
            setFoodEntries([]);
         }
      }
      setMessage(null);
   }, [selectedDate, findMostRecentMetricsData]);

   useEffect(() => {
      loadDataForSelectedDate();
   }, [selectedDate, loadDataForSelectedDate]);

   // Effect to update heightInput display when unit preference changes
   useEffect(() => {
      const heightCm = convertHeightToCm(heightInput, unitPreferences.height === 'cm' ? 'ft/in' : 'cm'); // Convert from current display to cm
      if (heightCm > 0) { // only update if there's a valid number
         setHeightInput(convertCmToDisplayHeight(heightCm, unitPreferences.height));
      }
      // This effect might need refinement to avoid converting an empty string or triggering loops.
      // It's primarily for when the user changes units in settings and comes back.
   }, [unitPreferences.height]); // Only re-run if height unit preference changes


   const handleSaveMetrics = () => {
      const morningW = morningWeight === "" ? null : Number(morningWeight);
      const eveningW = eveningWeight === "" ? null : Number(eveningWeight);
      
      // Convert heightInput to CM for consistent storage, using current unit preference
      const heightToSaveCm = heightInput === "" ? null : convertHeightToCm(heightInput, unitPreferences.height);
      const currentAgeVal = age === "" ? null : Number(age);

      if ((morningWeight !== "" && (isNaN(morningW!) || morningW! <= 0)) || 
          (eveningWeight !== "" && (isNaN(eveningW!) || eveningW! <= 0)) || 
          (heightInput !== "" && (heightToSaveCm === null || heightToSaveCm <= 0)) || // Check converted CM value
          (age !== "" && (isNaN(currentAgeVal!) || currentAgeVal! <= 0))) {
         setMessage("All entered values must be positive numbers."); return;
      }

      const metricsDataToSave: IDailyWeightFood = {
         date: selectedDate.toISOString().split('T')[0],
         morningWeight: morningW,
         eveningWeight: eveningW,
         height: heightToSaveCm, // Save height in CM
         age: currentAgeVal,
         foodEntries: foodEntries,
      };
      saveWeightForDay(selectedDate, metricsDataToSave);
      setMessage("Metrics data saved successfully!");
      setTimeout(() => setMessage(null), 3000);
   };

   return {
      morningWeight, setMorningWeight,
      eveningWeight, setEveningWeight,
      heightInput, setHeightInput, // Changed from height to heightInput
      age, setAge,
      bmi, bmiCategory, bmr,
      message, unitPreferences,
      handleSaveMetrics,
   };
};