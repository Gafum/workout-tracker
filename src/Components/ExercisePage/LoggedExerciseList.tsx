import React, { useEffect, useRef } from "react";
import Sortable from "sortablejs";
import { useLanguage } from "../../Context/LanguageContext";
import { IExerciseEntry } from "../../Types/AppTypes";
import { LoggedExerciseItem } from "./LoggedExerciseItem";

interface ILoggedExerciseListProps {
   exercises: IExerciseEntry[];
   onEditExercise: (id: string) => void;
   onDeleteExercise: (id: string) => void;
   isEditingAnyExercise: boolean;
   onReorderExercises?: (reorderedExercises: IExerciseEntry[]) => void;
}

export const LoggedExerciseList: React.FC<ILoggedExerciseListProps> = ({
   exercises,
   onEditExercise,
   onDeleteExercise,
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
         <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3 sm:mb-4">
            {t("logged_exercises")}
         </h3>

         <div ref={listRef} className="space-y-3 sm:space-y-4">
            {exercises.map((exercise) => (

               <div
                  key={exercise.id}
                  data-id={exercise.id}
                  className="select-none bg-white border border-gray-200 rounded-lg p-3 sm:p-4 shadow-sm flex items-center"
               >

                  <div
                     className="drag-handle text-gray-400 hover:text-gray-600 p-2 mr-2 cursor-grab active:cursor-grabbing touch-none flex-shrink-0 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
                     title={t("drag_to_reorder")}
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 8h16M4 16h16" />
                     </svg>
                  </div>

                  <div className="flex-grow min-w-0">
                     <LoggedExerciseItem
                        exercise={exercise}
                        onEdit={onEditExercise}
                        onDelete={onDeleteExercise}
                        isDraggable={false}
                     />
                  </div>
               </div>
            ))}
         </div>
      </div>
   );
};