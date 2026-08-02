import React from "react";

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

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#64748b", // Сталевий колір для видикремлення неактивних м'язів
}) => {
   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;

   // Глибокі темні контури-тіні між м'язами
   const BASE_COLOR = "#0f172a";

   const renderMuscleGroup = (
      id: MuscleId | null,
      paths: string[],
      isStatic: boolean = false,
   ) => {
      const fill = isStatic || !id ? BASE_COLOR : getColor(id);

      const interactiveProps = !isStatic && id
         ? {
            onClick: () => onMuscleClick(id),
            className: "group cursor-pointer outline-none",
         }
         : { className: "outline-none" };

      const pathClasses = !isStatic && id
         ? "transition-all duration-200 group-hover:brightness-125 group-hover:contrast-125"
         : "";

      return (
         <g {...interactiveProps}>
            {paths.map((path, index) => (
               <React.Fragment key={index}>
                  <path d={path} fill={fill} className={pathClasses} />
                  <g transform="translate(200, 0) scale(-1, 1)">
                     <path d={path} fill={fill} className={pathClasses} />
                  </g>
               </React.Fragment>
            ))}
         </g>
      );
   };

   // Чіткий, спортивний каркас атлетичного чоловіка
   const renderBaseBody = () => {
      const rightHalf = "M 100,12 C 112,12 116,22 114,38 C 112,50 112,56 114,64 C 125,66 148,72 170,85 C 185,96 188,118 180,136 C 186,156 182,182 175,198 C 182,218 175,252 160,262 C 166,282 152,302 148,272 C 146,242 152,212 148,192 C 144,172 140,152 138,138 C 142,158 140,188 126,212 C 130,228 132,248 132,272 C 142,298 145,348 130,392 C 138,412 130,428 116,428 L 102,428 L 102,392 C 105,362 102,328 106,298 C 110,278 112,242 100,200 Z";

      return (
         <g id="base-body" fill={BASE_COLOR}>
            <path d={rightHalf} />
            <g transform="translate(200, 0) scale(-1, 1)">
               <path d={rightHalf} />
            </g>
         </g>
      );
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[320px] sm:max-w-md mx-auto p-4 bg-[#f8fafc] rounded-3xl border border-gray-200 shadow-inner">
         <svg
            viewBox="0 0 200 440"
            className="w-full h-auto max-h-[550px] select-none filter drop-shadow-md"
         >
            {renderBaseBody()}

            {view === "front" ? (
               <g id="front-muscles">
                  {/* Потужні груди */}
                  {renderMuscleGroup("chest", [
                     "M 101,74 L 122,74 C 146,76 156,88 154,112 C 144,126 120,124 101,122 Z"
                  ])}

                  {/* Широкі дельти (плечі) */}
                  {renderMuscleGroup("shoulders", [
                     "M 148,76 C 172,84 184,102 178,130 L 160,138 L 148,110 Z"
                  ])}

                  {/* Біцепси та передпліччя */}
                  {renderMuscleGroup("biceps", [
                     "M 148,115 L 158,136 C 168,152 168,165 158,180 L 144,170 C 148,155 148,132 148,115 Z",
                     "M 154,182 C 166,198 170,218 162,242 L 150,234 C 154,212 150,195 142,176 Z"
                  ])}

                  {/* Прес (рельєфні кубики) */}
                  {renderMuscleGroup("abs", [
                     "M 101,125 L 120,125 L 118,145 L 101,145 Z",
                     "M 101,148 L 116,148 L 113,170 L 101,170 Z",
                     "M 101,173 L 111,173 L 106,198 L 101,198 Z",
                     "M 122,125 C 138,132 148,162 134,195 L 108,198 L 115,170 L 118,145 Z"
                  ])}

                  {/* Квадрицепси */}
                  {renderMuscleGroup("quads", [
                     "M 130,198 C 150,222 155,278 140,324 L 124,324 C 136,278 130,232 115,210 C 120,202 125,198 130,198 Z",
                     "M 101,235 C 108,225 112,215 115,210 C 130,232 136,278 124,324 L 101,324 Z"
                  ])}

                  {/* Ікри */}
                  {renderMuscleGroup("calves", [
                     "M 103,342 L 130,342 C 144,368 136,402 122,416 L 106,408 Z"
                  ])}
               </g>
            ) : (
               <g id="back-muscles">
                  {/* Спина (потужні трапеції та V-подібні широкі) */}
                  {renderMuscleGroup("back", [
                     "M 101,64 L 118,64 C 138,70 156,78 170,88 L 152,104 L 101,124 Z",
                     "M 101,126 L 152,104 C 162,126 158,162 134,188 L 101,188 Z",
                     "M 101,190 L 126,190 L 132,214 L 101,218 Z"
                  ])}

                  {/* Задні дельти */}
                  {renderMuscleGroup("shoulders", [
                     "M 148,78 C 172,86 184,104 178,132 L 160,140 L 148,112 Z"
                  ])}

                  {/* Трицепси та передпліччя */}
                  {renderMuscleGroup("triceps", [
                     "M 146,112 C 156,112 170,122 172,148 C 172,162 166,172 158,180 L 144,170 C 150,152 150,132 146,112 Z",
                     "M 154,182 C 166,198 170,218 162,242 L 150,234 C 154,212 150,195 142,176 Z"
                  ])}

                  {/* Сідниці */}
                  {renderMuscleGroup("glutes", [
                     "M 101,220 L 134,214 C 152,232 154,260 142,284 L 101,288 Z"
                  ])}

                  {/* Біцепс стегна */}
                  {renderMuscleGroup("hamstrings", [
                     "M 102,290 L 142,286 C 150,310 140,340 130,344 L 102,344 Z"
                  ])}

                  {/* Ікри (задня частина) */}
                  {renderMuscleGroup("calves", [
                     "M 103,350 L 130,350 C 144,376 136,410 122,424 L 106,416 Z"
                  ])}
               </g>
            )}
         </svg>
      </div>
   );
};