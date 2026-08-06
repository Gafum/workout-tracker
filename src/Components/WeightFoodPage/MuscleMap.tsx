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

// Тільки ті м'язи, які реально є у вашому додатку і мають клікатись
const MUSCLE_MAPPING: Record<MuscleId, Slug[]> = {
   chest: ["chest"],
   back: ["trapezius", "upper-back", "lower-back"],
   shoulders: ["deltoids"],
   biceps: ["biceps"],
   triceps: ["triceps"],
   abs: ["abs", "obliques"],
   quads: ["quadriceps"],
   hamstrings: ["hamstring"],
   calves: ["calves"],
   glutes: ["gluteal"],
};

// Повний список усіх можливих частин тіла з бібліотеки
const ALL_SLUGS: Slug[] = [
   "abs", "adductors", "ankles", "biceps", "calves", "chest", "deltoids",
   "feet", "forearm", "gluteal", "hamstring", "hands", "hair", "head",
   "knees", "lower-back", "neck", "obliques", "quadriceps", "tibialis",
   "trapezius", "triceps", "upper-back"
];

// Автоматично знаходжу всі "зайві" деталі (голова, шия, передпліччя, стопи і т.д.)
const ACTIVE_SLUGS = Object.values(MUSCLE_MAPPING).flat();
const NON_INTERACTIVE_SLUGS = ALL_SLUGS.filter((slug) => !ACTIVE_SLUGS.includes(slug));

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#334155", // Сірий колір для ваших м'язів, коли вони не вибрані
}) => {
   // Формуємо масив даних тільки для активних м'язів
   const bodyData: ExtendedBodyPart[] = Object.entries(muscleColors).flatMap(([id, color]) => {
      const mappedSlugs = MUSCLE_MAPPING[id as MuscleId];
      if (!mappedSlugs) return [];

      return mappedSlugs.map((slug) => ({
         slug,
         color,
      }));
   });

   // Обробка кліку (ігнорує всі зайві кліки)
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
            disabledParts={NON_INTERACTIVE_SLUGS} // Усі дрібні/непотрібні деталі блокуються і стають просто суцільним фоном
            defaultFill={emptyColor}
            defaultStroke="#0f172a" // Темний контур між блоками
            defaultStrokeWidth={1}
            border="none"
         />
      </div>
   );
};