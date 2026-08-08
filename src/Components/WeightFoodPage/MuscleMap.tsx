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

const SILHOUETTE_PARTS: Slug[] = [
   "head",
   "hair",
   "neck",
   "forearm",
   "hands",
   "feet",
   "ankles",
   "knees",
   "tibialis",
   "adductors",
];

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#f1f5f9", // Світло-сірий фон для порожніх м'язів
}) => {
   // Функція для отримання поточного кольору
   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;

   // Функція для генерації унікального ID патерну. 
   // Завдяки цьому компонент МИТТЄВО оновлюється при зміні кольору!
   const getPatternId = (id: MuscleId) => `pattern-${id}-${getColor(id).replace('#', '')}`;

   const bodyData: ExtendedBodyPart[] = (Object.keys(MUSCLE_MAPPING) as MuscleId[]).flatMap((id) => {
      const mappedSlugs = MUSCLE_MAPPING[id];

      return mappedSlugs.map((slug) => ({
         slug,
         // Динамічне посилання на патерн змушує SVG відразу перемальовуватись
         color: `url(#${getPatternId(id)})`,
         styles: {
            stroke: "#94a3b8", // Колір контурів між самими м'язами
            strokeWidth: 1,
         },
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

   // Налаштування для стилю ліній/крапок на фоні м'язів
   const PATTERN_COLOR = "#1e293b"; // Темно-графітовий колір (видно і на світлому, і на кольоровому)
   const PATTERN_OPACITY = "0.2"; // Легка прозорість, щоб не різало око

   return (
      <div
         className="relative flex w-full justify-center items-center p-2 bg-transparent 
         [&_[aria-label*='male-body-outline']]:!stroke-[0.75px] 
         [&_[aria-label*='male-body-outline']]:!fill-slate-100"
      >
         {/* Прихований SVG блок з нашими патернами */}
         <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
               <pattern id={getPatternId("chest")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("chest")} />
                  <line x1="0" y1="0" x2="16" y2="16" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("back")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("back")} />
                  <line x1="0" y1="8" x2="16" y2="8" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("shoulders")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("shoulders")} />
                  <circle cx="8" cy="8" r="2.5" fill={PATTERN_COLOR} opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("biceps")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("biceps")} />
                  <line x1="8" y1="0" x2="8" y2="16" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("triceps")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("triceps")} />
                  <path d="M0 0 L16 16 M16 0 L0 16" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("abs")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("abs")} />
                  <line x1="0" y1="16" x2="16" y2="0" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("quads")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("quads")} />
                  <path d="M 0 8 L 8 0 L 16 8" fill="none" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("hamstrings")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("hamstrings")} />
                  <path d="M 0 0 L 8 8 L 16 0" fill="none" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("calves")} width="12" height="12" patternUnits="userSpaceOnUse">
                  <rect width="12" height="12" fill={getColor("calves")} />
                  <circle cx="6" cy="6" r="2" fill={PATTERN_COLOR} opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("glutes")} width="16" height="16" patternUnits="userSpaceOnUse">
                  <rect width="16" height="16" fill={getColor("glutes")} />
                  <rect x="4" y="4" width="8" height="8" fill="none" stroke={PATTERN_COLOR} strokeWidth="1.5" opacity={PATTERN_OPACITY} />
               </pattern>
            </defs>
         </svg>

         <Body
            gender="male"
            side={view === "front" ? "front" : "back"}
            data={bodyData}
            onBodyPartPress={handleBodyPartPress}
            disabledParts={SILHOUETTE_PARTS} // Малює фонові частини (голова, стопи), не дає клікати
            defaultFill={emptyColor}
            border="#cbd5e1" // Задає колір основної обводки тіла. Товщина тепер контролюється через !stroke-[0.75px] вище
         />
      </div>
   );
};