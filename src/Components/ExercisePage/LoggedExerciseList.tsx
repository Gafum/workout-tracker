import React from "react";
import { IExerciseEntry } from "../../Types/AppTypes"; // Updated import path
import { LoggedExerciseItem } from "./LoggedExerciseItem";
import { useLanguage } from "../../Context/LanguageContext"; // Add this import

interface ILoggedExerciseListProps {
   exercises: IExerciseEntry[];
   onEditExercise: (id: string) => void;
   onDeleteExercise: (id: string) => void;
   isEditingAnyExercise: boolean; // To hide "No exercises" message when form is in edit mode
}

export const LoggedExerciseList: React.FC<ILoggedExerciseListProps> = ({
   exercises,
   onEditExercise,
   onDeleteExercise,
   isEditingAnyExercise,
}) => {
   const { t } = useLanguage(); // Add this line to use translations
   
   if (exercises.length === 0 && !isEditingAnyExercise) {
      return (
         <p className="text-center text-gray-500 italic mt-6 sm:mt-8">
            {t("no_exercises_logged")}
         </p>
      );
   }

   if (exercises.length === 0 && isEditingAnyExercise) {
      return null; // Don't show "no exercises" if we are editing (form is visible)
   }

   return (
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
         <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-2 sm:mb-3">
            {t("logged_exercises")}
         </h3>
         {exercises.map((exercise) => (
            <LoggedExerciseItem
               key={exercise.id}
               exercise={exercise}
               onEdit={onEditExercise}
               onDelete={onDeleteExercise}
            />
         ))}
      </div>
   );
};