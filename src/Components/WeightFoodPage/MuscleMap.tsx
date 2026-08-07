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

// Об'єднуємо дрібні шматки в єдині понятні групи
const MUSCLE_MAPPING: Record<MuscleId, Slug[]> = {
   chest: ["chest"],
   back: ["trapezius", "upper-back", "lower-back"], // Всі 3 частини зіллються в один блок спини
   shoulders: ["deltoids"],
   biceps: ["biceps"],
   triceps: ["triceps"],
   abs: ["abs", "obliques"], // Прес і боки зливаються в один кубик/блок
   quads: ["quadriceps"],
   hamstrings: ["hamstring"],
   calves: ["calves"],
   glutes: ["gluteal"],
};

const ALL_SLUGS: Slug[] = [
   "abs", "adductors", "ankles", "biceps", "calves", "chest", "deltoids",
   "feet", "forearm", "gluteal", "hamstring", "hands", "hair", "head",
   "knees", "lower-back", "neck", "obliques", "quadriceps", "tibialis",
   "trapezius", "triceps", "upper-back"
];

const ACTIVE_SLUGS = Object.values(MUSCLE_MAPPING).flat();
// Всі сірі дрібниці (голова, шия, передпліччя) повністю видаляються з екрану
const HIDDEN_SLUGS = ALL_SLUGS.filter((slug) => !ACTIVE_SLUGS.includes(slug));

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#334155",
}) => {
   const bodyData: ExtendedBodyPart[] = Object.entries(muscleColors).flatMap(([id, color]) => {
      const mappedSlugs = MUSCLE_MAPPING[id as MuscleId];
      if (!mappedSlugs) return [];

      return mappedSlugs.map((slug) => ({
         slug,
         color,
      }));
   });

   const handleBodyPartPress = (bodyPart: ExtendedBodyPart) => {
      if (!bodyPart.slug) return;

      const foundEntry = Object.entries(MUSCLE_MAPPING).find(([_, slugs]) =>
         slugs.includes(bodyPart.slug!)
      );

      if (foundEntry) {
         onMuscleClick(foundEntry[0] as MuscleId);
      }
   };

   return (
      <div className="flex w-full justify-center items-center">
         <Body
            gender="male"
            side={view === "front" ? "front" : "back"}
            data={bodyData}
            onBodyPartPress={handleBodyPartPress}
            hiddenParts={HIDDEN_SLUGS}
            defaultFill={emptyColor}
            defaultStroke="none"
            border="none"
         />
      </div>
   );
};