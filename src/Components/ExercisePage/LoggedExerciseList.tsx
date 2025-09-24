import React, { useState } from "react";
import { IExerciseEntry } from "../../Types/AppTypes"; // Updated import path
import { LoggedExerciseItem } from "./LoggedExerciseItem";
import { useLanguage } from "../../Context/LanguageContext"; // Add this import

interface ILoggedExerciseListProps {
   exercises: IExerciseEntry[];
   onEditExercise: (id: string) => void;
   onDeleteExercise: (id: string) => void;
   isEditingAnyExercise: boolean; // To hide "No exercises" message when form is in edit mode
   onReorderExercises?: (reorderedExercises: IExerciseEntry[]) => void; // New prop for reordering
}

export const LoggedExerciseList: React.FC<ILoggedExerciseListProps> = ({
   exercises,
   onEditExercise,
   onDeleteExercise,
   isEditingAnyExercise,
   onReorderExercises,
}) => {
   const { t } = useLanguage(); // Add this line to use translations
   const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
   
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

   const handleDragStart = (index: number) => {
      setDraggedIndex(index);
   };

   const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault(); // Allow drop
   };

   const handleDrop = (index: number) => {
      if (draggedIndex === null || draggedIndex === index) return;
      
      const reorderedExercises = [...exercises];
      const [draggedExercise] = reorderedExercises.splice(draggedIndex, 1);
      reorderedExercises.splice(index, 0, draggedExercise);
      
      if (onReorderExercises) {
         onReorderExercises(reorderedExercises);
      }
      
      setDraggedIndex(null);
   };

   return (
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
         <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-2 sm:mb-3">
            {t("logged_exercises")}
         </h3>
         <div className="space-y-3 sm:space-y-4">
            {exercises.map((exercise, index) => (
               <div
                  key={exercise.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(index)}
                  className={`${draggedIndex === index ? 'opacity-50' : ''}`}
               >
                  <LoggedExerciseItem
                     exercise={exercise}
                     onEdit={onEditExercise}
                     onDelete={onDeleteExercise}
                     isDraggable={true}
                  />
               </div>
            ))}
         </div>
      </div>
   );
};