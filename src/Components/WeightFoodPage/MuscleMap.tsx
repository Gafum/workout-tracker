import React from "react";

export type MuscleId =
   | "chest" | "back" | "shoulders" | "biceps" | "triceps"
   | "abs" | "quads" | "hamstrings" | "calves" | "glutes";

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
   emptyColor = "#e5e7eb", // Колір м'яза без даних
}) => {
   // Функція для отримання кольору м'яза або кольору за замовчуванням
   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;

   // Темно-сірий колір для "кістяка" і суглобів
   const BASE_COLOR = "#374151";

   // Функція для рендеру м'язів з автоматичним дзеркаленням лівої сторони
   const renderMuscleGroup = (id: MuscleId, rightPath: string, isStatic: boolean = false) => {
      const fill = isStatic ? BASE_COLOR : getColor(id);
      const interactiveProps = !isStatic ? {
         onClick: () => onMuscleClick(id),
         className: "cursor-pointer transition-all duration-300 hover:brightness-110 stroke-[1.5] stroke-white hover:stroke-gray-300",
      } : { className: "stroke-none" };

      return (
         <g {...interactiveProps}>
            {/* Права сторона (оригінал) */}
            <path d={rightPath} fill={fill} />
            {/* Ліва сторона (дзеркало відносно центру X=100) */}
            <g transform="translate(200, 0) scale(-1, 1)">
               <path d={rightPath} fill={fill} />
            </g>
         </g>
      );
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[280px] sm:max-w-sm mx-auto p-4 bg-[#f8fafc] rounded-3xl border border-gray-200 shadow-inner">
         <svg viewBox="0 0 200 420" className="w-full h-auto max-h-[500px] select-none filter drop-shadow-md">

            {/* БАЗОВИЙ СИЛУЕТ ТІЛА (ФОН) */}
            <g id="base-body" fill={BASE_COLOR}>
               {/* Голова і шия */}
               <path d="M100,15 C90,15 85,28 85,42 C85,55 92,62 94,68 L94,80 L106,80 L106,68 C108,62 115,55 115,42 C115,28 110,15 100,15 Z" />
               {/* Руки (кисті) */}
               <path d="M35,210 C30,225 25,235 20,230 C15,225 22,210 26,190 L42,190 Z" />
               <path d="M165,210 C170,225 175,235 180,230 C185,225 178,210 174,190 L158,190 Z" />
               {/* Ступні */}
               <path d="M85,385 L75,405 C70,410 80,412 88,410 L92,390 Z" />
               <path d="M115,385 L125,405 C130,410 120,412 112,410 L108,390 Z" />
               {/* Суглоби */}
               <circle cx="100" cy="220" r="15" />
            </g>

            {/* М'ЯЗИ (Фронт або Тил) */}
            {view === "front" ? (
               <g id="front-muscles">
                  {/* Шия (статика) */}
                  {renderMuscleGroup("back" as MuscleId, "M100,66 L112,68 L135,78 L100,85 Z", true)}

                  {/* Chest */}
                  {renderMuscleGroup("chest", "M101,84 L138,82 C142,95 140,105 132,112 C120,118 101,115 101,115 Z")}

                  {/* Abs (6-pack) */}
                  {renderMuscleGroup("abs", "M101,118 L122,118 L118,135 L101,135 Z")}
                  {renderMuscleGroup("abs", "M101,138 L117,138 L114,155 L101,155 Z")}
                  {renderMuscleGroup("abs", "M101,158 L112,158 L108,175 L101,175 Z")}
                  {/* Obliques */}
                  {renderMuscleGroup("abs", "M125,118 C135,130 130,155 118,170 L113,165 C122,145 120,130 120,118 Z")}

                  {/* Shoulders */}
                  {renderMuscleGroup("shoulders", "M141,80 C155,82 166,95 166,115 L152,125 L141,105 Z")}

                  {/* Biceps & Forearms (mapped to biceps for front) */}
                  {renderMuscleGroup("biceps", "M150,128 L165,118 C170,130 172,145 162,160 L150,150 Z")}
                  {renderMuscleGroup("biceps", "M156,165 L166,158 C172,175 168,195 158,205 L150,195 Z")}

                  {/* Quads */}
                  {renderMuscleGroup("quads", "M101,185 L125,180 C138,200 138,260 122,285 L105,280 Z")}
                  {renderMuscleGroup("quads", "M128,185 L140,210 C140,230 135,250 125,275 L120,250 Z")} {/* Outer Quad line */}

                  {/* Calves */}
                  {renderMuscleGroup("calves", "M106,305 L122,300 C128,320 125,355 116,380 L104,375 Z")}
               </g>
            ) : (
               <g id="back-muscles">
                  {/* Traps */}
                  {renderMuscleGroup("back", "M101,66 L112,68 L140,85 L101,105 Z")}

                  {/* Lats */}
                  {renderMuscleGroup("back", "M101,108 L138,90 C145,115 135,145 118,165 L101,165 Z")}

                  {/* Lower Back */}
                  {renderMuscleGroup("back", "M101,168 L116,168 L112,185 L101,185 Z")}

                  {/* Shoulders (Rear) */}
                  {renderMuscleGroup("shoulders", "M143,80 C155,82 166,95 166,115 L152,125 L143,105 Z")}

                  {/* Triceps & Forearms (mapped to triceps for back) */}
                  {renderMuscleGroup("triceps", "M150,128 L165,118 C170,130 172,145 162,160 L150,150 Z")}
                  {renderMuscleGroup("triceps", "M156,165 L166,158 C172,175 168,195 158,205 L150,195 Z")}

                  {/* Glutes */}
                  {renderMuscleGroup("glutes", "M101,188 L128,188 C138,205 135,235 120,245 L101,240 Z")}

                  {/* Hamstrings */}
                  {renderMuscleGroup("hamstrings", "M105,245 L125,248 C130,270 125,295 115,305 L105,295 Z")}

                  {/* Calves (Rear) */}
                  {renderMuscleGroup("calves", "M106,315 L122,310 C128,330 125,365 116,385 L104,380 Z")}
               </g>
            )}
         </svg>
      </div>
   );
};