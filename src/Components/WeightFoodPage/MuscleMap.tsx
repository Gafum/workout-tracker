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
   emptyColor = "#f1f5f9",
}) => {
   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;

   const getPatternId = (id: MuscleId) => `pattern-${id}-${getColor(id).replace(/[^a-zA-Z0-9]/g, "")}`;

   const bodyData: ExtendedBodyPart[] = (Object.keys(MUSCLE_MAPPING) as MuscleId[]).flatMap((id) => {
      const mappedSlugs = MUSCLE_MAPPING[id];

      return mappedSlugs.map((slug) => ({
         slug,
         color: `url(#${getPatternId(id)})`,
         styles: {
            stroke: "#64748b",
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

   const PATTERN_COLOR = "#000000";
   const PATTERN_OPACITY = "0.15";

   return (
      <div
         className="relative flex w-full justify-center items-center p-2 bg-transparent 
         [&_[aria-label*='male-body-outline']]:!stroke-[#0f172a] 
         [&_[aria-label*='male-body-outline']]:!stroke-[1.2px] 
         [&_[aria-label*='male-body-outline']]:!fill-slate-50"
      >
         <svg className="absolute w-0 h-0 pointer-events-none" aria-hidden="true">
            <defs>
               <pattern id={getPatternId("chest")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("chest")} />
                  <line x1="0" y1="0" x2="32" y2="32" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("back")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("back")} />
                  <line x1="0" y1="16" x2="32" y2="16" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("shoulders")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("shoulders")} />
                  <circle cx="16" cy="16" r="5" fill={PATTERN_COLOR} opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("biceps")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("biceps")} />
                  <line x1="16" y1="0" x2="16" y2="32" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("triceps")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("triceps")} />
                  <path d="M0 0 L32 32 M32 0 L0 32" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("abs")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("abs")} />
                  <line x1="0" y1="32" x2="32" y2="0" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("quads")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("quads")} />
                  <path d="M 0 16 L 16 0 L 32 16" fill="none" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("hamstrings")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("hamstrings")} />
                  <path d="M 0 0 L 16 16 L 32 0" fill="none" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("calves")} width="24" height="24" patternUnits="userSpaceOnUse">
                  <rect width="24" height="24" fill={getColor("calves")} />
                  <circle cx="12" cy="12" r="4" fill={PATTERN_COLOR} opacity={PATTERN_OPACITY} />
               </pattern>

               <pattern id={getPatternId("glutes")} width="32" height="32" patternUnits="userSpaceOnUse">
                  <rect width="32" height="32" fill={getColor("glutes")} />
                  <rect x="8" y="8" width="16" height="16" fill="none" stroke={PATTERN_COLOR} strokeWidth="2" opacity={PATTERN_OPACITY} />
               </pattern>
            </defs>
         </svg>

         <Body
            gender="male"
            side={view === "front" ? "front" : "back"}
            data={bodyData}
            onBodyPartPress={handleBodyPartPress}
            disabledParts={SILHOUETTE_PARTS}
            defaultFill={emptyColor}
            border="#0f172a"
         />
      </div>
   );
};