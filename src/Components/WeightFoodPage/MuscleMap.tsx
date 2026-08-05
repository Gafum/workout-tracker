import React from "react";
import Body, { ExtendedBodyPart, Slug } from "react-muscle-highlighter";

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

// Строгий мапінг вашого MuscleId на офіційний тип Slug[]
const MUSCLE_MAPPING: Record<MuscleId, Slug[]> = {
   chest: ["chest"],
   back: ["trapezius", "upper-back", "lower-back"],
   shoulders: ["deltoids"],
   biceps: ["biceps", "forearm"],
   triceps: ["triceps"],
   abs: ["abs", "obliques"],
   quads: ["quadriceps"],
   hamstrings: ["hamstring"],
   calves: ["calves", "tibialis"],
   glutes: ["gluteal"],
};

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#334155", // Slate-700
}) => {
   // Формуємо масив строго за типом ExtendedBodyPart[]
   const bodyData: ExtendedBodyPart[] = Object.entries(muscleColors).flatMap(
      ([id, color]) => {
         const slugs = MUSCLE_MAPPING[id as MuscleId];
         if (!slugs) return [];

         return slugs.map((slug) => ({
            slug,
            color,
         }));
      },
   );

   // Типізований обробник кліку
   const handleBodyPartPress = (bodyPart: ExtendedBodyPart) => {
      if (!bodyPart.slug) return;

      const foundEntry = Object.entries(MUSCLE_MAPPING).find(([_, slugs]) =>
         slugs.includes(bodyPart.slug as Slug),
      );

      if (foundEntry) {
         onMuscleClick(foundEntry[0] as MuscleId);
      }
   };

   return (
      <div className="flex w-full justify-center items-center p-2">
         <Body
            gender="male"
            side={view}
            data={bodyData}
            onBodyPartPress={handleBodyPartPress}
            defaultFill={emptyColor}
            defaultStroke="#0f172a"
            defaultStrokeWidth={1.5}
            scale={1.1}
         />
      </div>
   );
};