import React, {  } from "react";
import { ReactSortable } from "react-sortablejs";
import { IExerciseEntry } from "../../Types/AppTypes";
import { useLanguage } from "../../Context/LanguageContext";
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

   // Функція зворотного виклику для react-sortablejs
   const handleSetList = (newState: IExerciseEntry[]) => {
      if (onReorderExercises) {
         // Перевіряємо, чи дійсно змінився порядок, щоб уникати зайвих рендерів
         const hasChanged = newState.some((item, index) => item.id !== exercises[index]?.id);
         if (hasChanged) {
            onReorderExercises(newState);
         }
      }
   };

   return (
      <div className="mt-6 sm:mt-8">
         <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3 sm:mb-4">
            {t("logged_exercises")}
         </h3>

         {/* 
            Налаштування SortableJS:
            - handle: перетягування працює ЛИШЕ за блок з цим класом (рятує скрол на мобільних)
            - scroll: вмикає автоскрол екрану при піднесенні до країв
            - ghostClass: напівпрозорий дублікат на місці майбутнього дропу
         */}
         <ReactSortable
            list={exercises}
            setList={handleSetList}
            handle=".drag-handle"
            animation={200}
            scroll={true}
            scrollSensitivity={100} // Починає скролити за 100px до краю екрану
            scrollSpeed={15}        // Швидкість автоскролу (пікселі)
            ghostClass="opacity-30"
            chosenClass="shadow-2xl"
            className="space-y-3 sm:space-y-4"
         >
            {exercises.map((exercise) => (
               <div key={exercise.id}>
                  <LoggedExerciseItem
                     exercise={exercise}
                     onEdit={onEditExercise}
                     onDelete={onDeleteExercise}
                     isDraggable={true}
                  />
               </div>
            ))}
         </ReactSortable>
      </div>
   );
};