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
   emptyColor = "#e5e7eb", // Колір м'яза без даних
}) => {
   // Функція для отримання кольору м'яза або кольору за замовчуванням
   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;

   // Темно-сірий колір для "кістяка" і суглобів
   const BASE_COLOR = "#374151";

   // Функція для рендеру м'язів, приймає МАСИВ шляхів для командного ховеру
   const renderMuscleGroup = (
      id: MuscleId | null,
      paths: string[],
      isStatic: boolean = false,
   ) => {
      const fill = isStatic || !id ? BASE_COLOR : getColor(id);

      // Tailwind 'group' об'єднує всі елементи масиву для одночасного ховеру
      const interactiveProps = !isStatic && id
         ? {
            onClick: () => onMuscleClick(id),
            className: "group cursor-pointer outline-none",
         }
         : { className: "outline-none" };

      // Анімація прозорості та бордерів при наведенні на будь-який елемент групи
      const pathClasses = !isStatic
         ? "transition-all duration-300 stroke-[1.5] stroke-white group-hover:opacity-80 group-hover:stroke-gray-300"
         : "stroke-none";

      return (
         <g {...interactiveProps}>
            {paths.map((path, index) => (
               <React.Fragment key={index}>
                  {/* Права сторона (оригінал) */}
                  <path d={path} fill={fill} className={pathClasses} />
                  {/* Ліва сторона (дзеркало відносно центру X=100) */}
                  <g transform="translate(200, 0) scale(-1, 1)">
                     <path d={path} fill={fill} className={pathClasses} />
                  </g>
               </React.Fragment>
            ))}
         </g>
      );
   };

   return (
      <div className="flex justify-center items-center w-full max-w-[280px] sm:max-w-sm mx-auto p-4 bg-[#f8fafc] rounded-3xl border border-gray-200 shadow-inner">
         <svg
            viewBox="0 0 200 420"
            className="w-full h-auto max-h-[500px] select-none filter drop-shadow-md"
         >
            {/* 
               BASE BODY (Кістяк)
               strokeWidth="5" та strokeLinejoin="round" органічно додають маси та згладжують кути, 
               роблячи тіло більш "людським" та широким.
            */}
            <g id="base-body" fill={BASE_COLOR} stroke={BASE_COLOR} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
               {/* Голова */}
               <path d="M100 18 C86 18 80 30 81 45 C82 58 88 66 94 70 L94 82 L106 82 L106 70 C112 66 118 58 119 45 C120 30 114 18 100 18 Z" />
               {/* Шия */}
               <path d="M91 68 C94 75 94 82 92 88 L108 88 C106 82 106 75 109 68 Z" />
               {/* Торс */}
               <path d="M92 82 C78 86 65 92 57 105 C52 115 54 140 60 160 C65 180 70 200 76 220 C82 235 118 235 124 220 C130 200 135 180 140 160 C146 140 148 115 143 105 C135 92 122 86 108 82 C103 88 97 88 92 82 Z" />
               {/* Ліва рука */}
               <path d="M58 104 C48 110 43 125 40 145 C37 165 34 185 28 205 C25 214 28 220 34 218 C43 214 48 190 53 170 C58 150 65 125 68 112 Z" />
               {/* Права рука */}
               <path d="M142 104 C152 110 157 125 160 145 C163 165 166 185 172 205 C175 214 172 220 166 218 C157 214 152 190 147 170 C142 150 135 125 132 112 Z" />
               {/* Таз */}
               <path d="M76 215 C82 205 118 205 124 215 C130 230 127 250 120 265 C108 275 92 275 80 265 C73 250 70 230 76 215 Z" />
               {/* Ліва нога */}
               <path d="M80 260 C76 290 75 320 78 350 C79 370 75 390 70 405 C75 412 90 412 94 405 L98 350 C100 320 101 285 96 260 Z" />
               {/* Права нога */}
               <path d="M120 260 C124 290 125 320 122 350 C121 370 125 390 130 405 C125 412 110 412 106 405 L102 350 C100 320 99 285 104 260 Z" />
               {/* Стопи */}
               <path d="M70 400 C60 410 60 416 72 418 L94 416 L94 405 Z" />
               <path d="M130 400 C140 410 140 416 128 418 L106 416 L106 405 Z" />
               {/* Кисті */}
               <circle cx="42" cy="170" r="4" stroke="none" />
               <circle cx="158" cy="170" r="4" stroke="none" />
            </g>

            {/* М'ЯЗИ (Фронт або Тил) */}
            {view === "front" ? (
               <g id="front-muscles">
                  {/* Шия (статика) */}
                  {renderMuscleGroup(null, ["M100,66 L112,68 L135,78 L100,85 Z"], true)}

                  {/* Груди */}
                  {renderMuscleGroup("chest", [
                     "M101,84 L138,82 C142,95 140,105 132,112 C120,118 101,115 101,115 Z"
                  ])}

                  {/* Прес (всі 4 частини тепер в одному масиві) */}
                  {renderMuscleGroup("abs", [
                     "M101,118 L122,118 L118,135 L101,135 Z", // Верхні кубики
                     "M101,138 L117,138 L114,155 L101,155 Z", // Середні
                     "M101,158 L112,158 L108,175 L101,175 Z", // Нижні
                     "M125,118 C135,130 130,155 118,170 L113,165 C122,145 120,130 120,118 Z" // Косі м'язи
                  ])}

                  {/* Плечі */}
                  {renderMuscleGroup("shoulders", [
                     "M141,80 C155,82 166,95 166,115 L152,125 L141,105 Z"
                  ])}

                  {/* Біцепси (разом з передпліччями) */}
                  {renderMuscleGroup("biceps", [
                     "M150,128 L165,118 C170,130 172,145 162,160 L150,150 Z", // Біцепс
                     "M156,165 L166,158 C172,175 168,195 158,205 L150,195 Z"  // Передпліччя
                  ])}

                  {/* Квадрицепси (внутрішня + зовнішня лінія) */}
                  {renderMuscleGroup("quads", [
                     "M101,185 L125,180 C138,200 138,260 122,285 L105,280 Z",
                     "M128,185 L140,210 C140,230 135,250 125,275 L120,250 Z"
                  ])}

                  {/* Ікри */}
                  {renderMuscleGroup("calves", [
                     "M106,305 L122,300 C128,320 125,355 116,380 L104,375 Z"
                  ])}
               </g>
            ) : (
               <g id="back-muscles">
                  {/* Спина (Трапеції + Найширші + Поперек) об'єднана в один масив */}
                  {renderMuscleGroup("back", [
                     "M101,66 L112,68 L140,85 L101,105 Z", // Traps
                     "M101,108 L138,90 C145,115 135,145 118,165 L101,165 Z", // Lats
                     "M101,168 L116,168 L112,185 L101,185 Z" // Lower Back
                  ])}

                  {/* Задні дельти (Плечі) */}
                  {renderMuscleGroup("shoulders", [
                     "M143,80 C155,82 166,95 166,115 L152,125 L143,105 Z"
                  ])}

                  {/* Трицепси (разом з передпліччями) */}
                  {renderMuscleGroup("triceps", [
                     "M150,128 L165,118 C170,130 172,145 162,160 L150,150 Z",
                     "M156,165 L166,158 C172,175 168,195 158,205 L150,195 Z"
                  ])}

                  {/* Сідниці */}
                  {renderMuscleGroup("glutes", [
                     "M101,188 L128,188 C138,205 135,235 120,245 L101,240 Z"
                  ])}

                  {/* Біцепс стегна (Hamstrings) */}
                  {renderMuscleGroup("hamstrings", [
                     "M105,245 L125,248 C130,270 125,295 115,305 L105,295 Z"
                  ])}

                  {/* Ікри (Задні) */}
                  {renderMuscleGroup("calves", [
                     "M106,315 L122,310 C128,330 125,365 116,385 L104,380 Z"
                  ])}
               </g>
            )}
         </svg>
      </div>
   );
};