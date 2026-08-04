import React from "react";
import Model from "react-muscle-highlighter";

export type MuscleId =
   | "chest"
   | "back"
   | "shoulders"
   | "biceps"
   | "triceps"
   | "abs"
   | "quads"
   | "hamstrings"
   | "calves"
   | "glutes";

interface MuscleMapProps {
   view: "front" | "back";
   muscleColors: Record<string, string>;
   onMuscleClick: (id: MuscleId) => void;
   emptyColor?: string;
}

// Мапінг ваших ключів на точні назви м me'язів (slug/name), які використовує бібліотека
const MUSCLE_MAPPING: Record<MuscleId, string[]> = {
   chest: ["chest"],
   back: ["trapezius", "upper-back", "lower-back"],
   shoulders: ["front-deltoids", "back-deltoids"],
   biceps: ["biceps"],
   triceps: ["triceps"],
   abs: ["abs", "obliques"],
   quads: ["quadriceps"],
   hamstrings: ["hamstring"],
   calves: ["calves"],
   glutes: ["gluteal"],
};

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#475569",
}) => {
   // Формуємо масив об'єктів без суворого типу Muscle, використовуючи any/Record для сумісності з типами бібліотеки
   const highlightedData = Object.entries(muscleColors).flatMap(([id]) => {
      const mappedMuscles = MUSCLE_MAPPING[id as MuscleId];
      if (!mappedMuscles) return [];

      return mappedMuscles.map((slug) => ({
         name: slug,
         slug: slug,
         fill: muscleColors[id],
      }));
   });

   // Обробник кліку по м'язу
   const handleMuscleClick = (payload: any) => {
      const clickedName = payload?.name || payload?.slug || payload;

      const foundEntry = Object.entries(MUSCLE_MAPPING).find(([_, muscles]) =>
         muscles.includes(clickedName)
      );

      if (foundEntry) {
         onMuscleClick(foundEntry[0] as MuscleId);
      }
   };

   const activeColor = Object.values(muscleColors)[0] || "#3b82f6";

   return (
      <div className="flex w-full justify-center ">
         <Model
            side={view === "front" ? "front" : "back"}
            data={highlightedData as any}
            onBodyPartPress={handleMuscleClick}
            defaultFill={emptyColor}
            colors={[activeColor]}
         />
      </div>
   );
};