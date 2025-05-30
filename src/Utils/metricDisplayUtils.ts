import { BmiCategory } from "../Types/AppTypes";

// Helper function to get BMI category
export const getBmiCategory = (bmi: number | null): BmiCategory => {
   if (bmi === null || isNaN(bmi) || bmi <= 0) return 'N/A';
   if (bmi < 18.5) return 'Underweight';
   if (bmi < 25) return 'Normal';
   if (bmi < 30) return 'Overweight';
   return 'Obese';
};

// Helper function to get BMI category color
export const getBmiColor = (category: BmiCategory): string => {
   switch (category) {
      case 'Underweight': return 'text-blue-500';
      case 'Normal': return 'text-green-500';
      case 'Overweight': return 'text-yellow-500';
      case 'Obese': return 'text-red-500';
      default: return 'text-gray-500';
   }
};