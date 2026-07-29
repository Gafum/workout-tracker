import React, { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import { useLanguage } from "../../Context/LanguageContext";
import { IExerciseEntry } from "../../Types/AppTypes";
import { LoggedExerciseItem } from "./LoggedExerciseItem";

interface ILoggedExerciseListProps {
   exercises: IExerciseEntry[];
   onEditExercise: (id: string) => void;
   onDeleteExercise: (id: string) => void;
   onDeleteAllExercises: () => void;
   isEditingAnyExercise: boolean;
   onReorderExercises?: (reorderedExercises: IExerciseEntry[]) => void;
}

export const LoggedExerciseList: React.FC<ILoggedExerciseListProps> = ({
   exercises,
   onEditExercise,
   onDeleteExercise,
   onDeleteAllExercises,
   isEditingAnyExercise,
   onReorderExercises,
}) => {
   const { t } = useLanguage();
   const listRef = useRef<HTMLDivElement>(null);
   const exercisesRef = useRef<IExerciseEntry[]>(exercises);

   useEffect(() => {
      exercisesRef.current = exercises;
   }, [exercises]);

   useEffect(() => {
      if (!listRef.current || exercises.length === 0) return;

      const sortable = new Sortable(listRef.current, {
         handle: ".drag-handle",
         animation: 200,

         delay: 300, // Чекати 200мс перед початком дрейгу
         delayOnTouchOnly: true,
         touchStartThreshold: 5,

         scroll: true,
         scrollSensitivity: 140,
         scrollSpeed: 22,
         bubbleScroll: true,

         ghostClass: "opacity-20",

         forceFallback: true,
         fallbackClass: "shadow-2xl",

         onEnd: (evt) => {
            const { oldIndex, newIndex } = evt;
            if (oldIndex === undefined || newIndex === undefined || oldIndex === newIndex) return;

            if (onReorderExercises) {
               const currentList = [...exercisesRef.current];
               const [movedItem] = currentList.splice(oldIndex, 1);
               currentList.splice(newIndex, 0, movedItem);

               onReorderExercises(currentList);
            }
         }
      });

      return () => {
         sortable.destroy();
      };
   }, [exercises.length]);

   if (exercises.length === 0 && !isEditingAnyExercise) {
      return (
         <p className="text-center text-gray-500 italic mt-6 sm:mt-8">
            {t("no_exercises_logged")}
         </p>
      );
   }

   if (exercises.length === 0 && isEditingAnyExercise) {
      return null;
   }

   return (
      <div className="mt-6 sm:mt-8">
         <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text">
               {t("logged_exercises")}
            </h3>

            {exercises.length > 0 && (
               <button
                  type="button"
                  onClick={onDeleteAllExercises}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-1"
                  title={t("delete_all") || "Delete all"}
               >
                  <svg
                     xmlns="http://www.w3.org/2000/svg"
                     className="h-3.5 w-3.5"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                     />
                  </svg>
                  <span>{t("delete_all") || "Видалити все"}</span>
               </button>
            )}
         </div>

         <div ref={listRef} className="space-y-3 sm:space-y-4">
            {exercises.map((exercise) => (
               <LoggedExerciseItem
                  key={exercise.id}
                  exercise={exercise}
                  onEdit={onEditExercise}
                  onDelete={onDeleteExercise}
                  isDraggable={false}
               />
            ))}
         </div>
      </div>
   );
};