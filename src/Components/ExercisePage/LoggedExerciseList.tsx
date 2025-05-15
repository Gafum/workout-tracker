import React from "react";
import { IExerciseEntry } from "../../Pages/Exercise/Exercise"; // Adjust path if IExerciseEntry is moved
import { LoggedExerciseItem } from "./LoggedExerciseItem";

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
   if (exercises.length === 0 && !isEditingAnyExercise) {
      return (
         <p className="text-center text-gray-500 italic mt-6 sm:mt-8">
            No exercises logged for this day yet. Add one above!
         </p>
      );
   }

   if (exercises.length === 0 && isEditingAnyExercise) {
      return null; // Don't show "no exercises" if we are editing (form is visible)
   }

   return (
      <div className="mt-6 sm:mt-8 space-y-3 sm:space-y-4">
         <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-2 sm:mb-3">
            Logged Exercises
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