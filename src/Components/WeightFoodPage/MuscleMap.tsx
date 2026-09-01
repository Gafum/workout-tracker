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
   emptyColor = "#1e293b",
}) => {
   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;
   const getPatternId = (id: MuscleId) => `pattern-${id}-${getColor(id).replace(/[^a-zA-Z0-9]/g, "")}`;

   const bodyData: ExtendedBodyPart[] = (Object.keys(MUSCLE_MAPPING) as MuscleId[]).flatMap((id) => {
      const mappedSlugs = MUSCLE_MAPPING[id];

      return mappedSlugs.map((slug) => ({
         slug,
         color: `url(#${getPatternId(id)})`,
         styles: {
            stroke: "#000000",
            strokeWidth: 1.5,
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

   const PATTERN_COLOR = "#ffffff";
   const PATTERN_OPACITY = "100";

   return (
      <div
         className="relative flex w-full justify-center items-center p-2 bg-transparent 
         [&_[aria-label*='male-body-outline']]:!stroke-[#000000] 
         [&_[aria-label*='male-body-outline']]:!stroke-[1.5px] 
         [&_[aria-label*='male-body-outline']]:!fill-slate-600
         [&_[id='head']]:!opacity-100
         [&_[id='hair']]:!opacity-100

         [&_[id='head']]:!fill-slate-600
         [&_[id='hair']]:!stroke-black
         [&_[id='hair']]:!stroke-[2px]
         [&_[id='hair']]:!fill-slate-600"
      >
         <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
               {/* ГРУДІ: Горизонтальні лінії */}
               <pattern id={getPatternId("chest")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("chest")} />
                  <line x1="0" y1="16" x2="32" y2="16" stroke={PATTERN_COLOR} strokeWidth="2.5" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* ПЛЕЧІ: Крапки / Кружечки */}
               <pattern id={getPatternId("shoulders")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("shoulders")} />
                  <circle cx="16" cy="16" r="5" fill={PATTERN_COLOR} opacity={PATTERN_OPACITY} />
               </pattern>

               {/* БІЦЕПС: Вертикальні лінії */}
               <pattern id={getPatternId("biceps")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("biceps")} />
                  <line x1="16" y1="0" x2="16" y2="32" stroke={PATTERN_COLOR} strokeWidth="2.5" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* ПРЕС: Двохсторонній хрестик / Сітка */}
               <pattern id={getPatternId("abs")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("abs")} />
                  <path d="M 0 0 L 32 32 M 32 0 L 0 32" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* КВАДРИЦЕПС: Діагональні лінії */}
               <pattern id={getPatternId("quads")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("quads")} />
                  <line x1="0" y1="32" x2="32" y2="0" stroke={PATTERN_COLOR} strokeWidth="2.5" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* СПИНА: Шеврон / Хвилі */}
               <pattern id={getPatternId("back")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("back")} />
                  <path d="M 0 16 L 16 0 L 32 16" fill="none" stroke={PATTERN_COLOR} strokeWidth="2.5" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* ТРИЦЕПС: Квадрати */}
               <pattern id={getPatternId("triceps")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("triceps")} />
                  <rect x="8" y="8" width="16" height="16" fill="none" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* СІДНИЦІ: Великі круги */}
               <pattern id={getPatternId("glutes")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("glutes")} />
                  <circle cx="16" cy="16" r="6" fill="none" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* БІЦЕПС СТЕГНА: Вертикальні лінії */}
               <pattern id={getPatternId("hamstrings")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("hamstrings")} />
                  <line x1="16" y1="0" x2="16" y2="32" stroke={PATTERN_COLOR} strokeWidth="2.5" opacity={PATTERN_OPACITY} />
               </pattern>

               {/* ІКРИ: Плюс / Плюсики */}
               <pattern id={getPatternId("calves")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("calves")} />
                  <path d="M 16 8 L 16 24 M 8 16 L 24 16" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>
            </defs>
         </svg>

         <Body
            gender="male"
            side={view === "front" ? "front" : "back"}
            data={bodyData}
            onBodyPartPress={handleBodyPartPress}
            hiddenParts={["neck", "feet", "ankles", "hands"]}
            disabledParts={SILHOUETTE_PARTS}
            defaultFill={emptyColor}
            border="#000000"
         />
      </div>
   );
};