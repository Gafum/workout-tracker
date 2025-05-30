import { useState, useEffect, useCallback } from "react";
import {
   loadWeightForDay, // Assuming from weightDataUtils.ts or re-exported
   saveWeightForDay, // Assuming from weightDataUtils.ts or re-exported
   loadUnitPreferences, // Assuming from unitPreferencesUtils.ts or re-exported
} from "../Utils/LocalStorageUtils"; 
import { IDailyWeightFood, IFoodEntry, IUnitPreferences, BmiCategory } from "../Types/AppTypes";
import { getBmiCategory } from "../Utils/metricDisplayUtils";

export const useWeightFood = (selectedDate: Date) => {
   const [morningWeight, setMorningWeight] = useState<string | number>("");
   const [eveningWeight, setEveningWeight] = useState<string | number>("");
   const [height, setHeight] = useState<string | number>("");
   const [age, setAge] = useState<string | number>("25");

   const [bmi, setBmi] = useState<number | null>(null);
   const [bmiCategory, setBmiCategory] = useState<BmiCategory>('N/A');
   const [bmr, setBmr] = useState<number | null>(null);

   const [message, setMessage] = useState<string | null>(null);
   const [foodEntries, setFoodEntries] = useState<IFoodEntry[]>([]); 
   const [unitPreferences, setUnitPreferences] = useState<IUnitPreferences>(loadUnitPreferences());

   const calculateMetrics = useCallback(() => {
      const weightKg = unitPreferences.weight === 'lbs' 
         ? (Number(morningWeight) || Number(eveningWeight) || 0) * 0.453592 
         : (Number(morningWeight) || Number(eveningWeight) || 0);
      
      let heightCm = 0;
      if (unitPreferences.height === 'cm') {
         heightCm = Number(height) || 0;
      } else { // 'ft', assuming height state stores total inches
         heightCm = (Number(height) || 0) * 2.54;
      }
      const heightM = heightCm / 100;
      const currentAgeVal = Number(age) || 25;

      if (weightKg > 0 && heightM > 0) {
         const newBmi = weightKg / (heightM * heightM);
         setBmi(parseFloat(newBmi.toFixed(1)));
         setBmiCategory(getBmiCategory(newBmi));
      } else {
         setBmi(null);
         setBmiCategory('N/A');
      }

      if (weightKg > 0 && heightCm > 0 && currentAgeVal > 0) {
         const newBmr = (10 * weightKg) + (6.25 * heightCm) - (5 * currentAgeVal) + 5; // Mifflin-St Jeor for male
         setBmr(parseFloat(newBmr.toFixed(0)));
      } else {
         setBmr(null);
      }
   }, [morningWeight, eveningWeight, height, age, unitPreferences]);

   useEffect(() => {
      calculateMetrics();
   }, [calculateMetrics]);

   const findMostRecentMetricsData = useCallback((): IDailyWeightFood | null => {
      const today = new Date();
      let currentDate = new Date(today);
      const oneYearAgo = new Date(today);
      oneYearAgo.setFullYear(today.getFullYear() - 1);

      while (currentDate >= oneYearAgo) {
         const data = loadWeightForDay(currentDate) as IDailyWeightFood | null;
         if (data && (data.morningWeight !== undefined || data.eveningWeight !== undefined || data.height !== undefined)) {
            return data;
         }
         currentDate.setDate(currentDate.getDate() - 1);
      }
      return null;
   }, []);

   const loadDataForSelectedDate = useCallback(() => {
      const loadedData = loadWeightForDay(selectedDate) as IDailyWeightFood | null;
      if (loadedData) {
         setMorningWeight(loadedData.morningWeight ?? "");
         setEveningWeight(loadedData.eveningWeight ?? "");
         setHeight(loadedData.height ?? "");
         setAge(loadedData.age ?? "25");
         setFoodEntries(loadedData.foodEntries ?? []);
      } else {
         const recentData = findMostRecentMetricsData();
         if (recentData) {
            setMorningWeight(recentData.morningWeight ?? "");
            setEveningWeight(recentData.eveningWeight ?? "");
            setHeight(recentData.height ?? "");
            setAge(recentData.age ?? "25");
            setFoodEntries([]); 
         } else {
            setMorningWeight("");
            setEveningWeight("");
            setHeight("");
            setAge("25");
            setFoodEntries([]);
         }
      }
      setMessage(null);
   }, [selectedDate, findMostRecentMetricsData]);

   useEffect(() => {
      setUnitPreferences(loadUnitPreferences());
      loadDataForSelectedDate();
   }, [selectedDate, loadDataForSelectedDate]);

   const handleSaveMetrics = () => {
      const morningW = morningWeight === "" ? null : Number(morningWeight);
      const eveningW = eveningWeight === "" ? null : Number(eveningWeight);
      const currentHeight = height === "" ? null : Number(height);
      const currentAgeVal = age === "" ? null : Number(age);

      if ((morningWeight !== "" && (isNaN(morningW!) || morningW! <= 0)) || 
          (eveningWeight !== "" && (isNaN(eveningW!) || eveningW! <= 0)) || 
          (height !== "" && (isNaN(currentHeight!) || currentHeight! <= 0)) || 
          (age !== "" && (isNaN(currentAgeVal!) || currentAgeVal! <= 0))) {
         setMessage("All entered values must be positive numbers."); return;
      }

      const metricsDataToSave: IDailyWeightFood = {
         date: selectedDate.toISOString().split('T')[0],
         morningWeight: morningW,
         eveningWeight: eveningW,
         height: currentHeight,
         age: currentAgeVal,
         foodEntries: foodEntries, // Persist current food entries for the day
      };
      saveWeightForDay(selectedDate, metricsDataToSave);
      setMessage("Metrics data saved successfully!");
      setTimeout(() => setMessage(null), 3000);
   };

   return {
      morningWeight, setMorningWeight,
      eveningWeight, setEveningWeight,
      height, setHeight,
      age, setAge,
      bmi, bmiCategory, bmr,
      message, unitPreferences,
      handleSaveMetrics,
      // foodEntries, setFoodEntries // Expose if food log is part of this component's direct responsibility
   };
};