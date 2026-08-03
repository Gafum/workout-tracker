import React, { useId } from "react";

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

// ---------------------------------------------------------------------------
// Форми м'язів заданi як звичайні SVG-шляхи (path) або "подушечки" (rect
// зi скругленими кутами — зручно для кубиків преса). Кожна форма описана
// лише для ПРАВОЇ половини тіла — лiву половину код дзеркалить автоматично
// вiдносно центральної осі x=100 (як i в оригiналi), тому досить намалювати
// один бiк.
// ---------------------------------------------------------------------------
type PathShape = { kind: "path"; d: string };
type RectShape = { kind: "rect"; x: number; y: number; width: number; height: number; rx: number };
type MuscleShape = PathShape | RectShape;

const p = (d: string): PathShape => ({ kind: "path", d });
const r = (x: number, y: number, width: number, height: number, rx: number): RectShape => ({
   kind: "rect",
   x,
   y,
   width,
   height,
   rx,
});

// Темний "кістяк" — базовий силует тіла. Він навмисно стрункiший за м'язи,
// щоб м'язи, накладенi зверху, виступали за його контур ("накачаний" вигляд).
const BASE_COLOR = "#3d3936";

const FRONT_MUSCLES: { id: MuscleId; shapes: MuscleShape[] }[] = [
   {
      id: "shoulders",
      shapes: [
         p("M107,88 C124,85 144,89 157,102 C167,112 170,127 165,140 C161,135 154,131 147,132 C144,118 137,105 127,98 C120,93 113,90 107,94 Z"),
      ],
   },
   {
      id: "chest",
      shapes: [
         p("M101,92 C111,89 122,90 130,97 C137,103 140,113 137,124 C134,133 125,138 115,137 C109,136 104,132 102,126 C99,116 99,102 101,92 Z"),
      ],
   },
   {
      id: "biceps",
      shapes: [
         p("M148,130 C157,126 166,129 171,139 C176,150 175,164 168,177 C163,184 154,185 149,179 C154,167 154,150 148,136 Z"),
         p("M151,182 C160,178 168,182 172,193 C176,207 173,225 165,239 C160,247 150,247 146,240 C153,225 156,205 151,190 Z"),
      ],
   },
   {
      id: "abs",
      shapes: [
         r(100.5, 137, 22, 15, 5),
         r(100.5, 156, 19, 14, 5),
         r(100.5, 174, 15, 15, 5),
         p("M129,146 C138,154 140,169 135,183 C132,190 128,194 124,193 C129,178 129,161 123,148 Z"),
      ],
   },
   {
      id: "quads",
      shapes: [
         p("M100.5,204 L128,202 C136,216 137,244 132,268 C128,286 120,298 109,299 C104,299 100.5,293 100.5,287 Z"),
         p("M131,205 C140,218 141,242 135,264 C132,277 128,286 123,291 C128,268 127,246 121,222 Z"),
      ],
   },
   {
      id: "calves",
      shapes: [
         p("M101,312 C111,309 123,311 128,322 C133,337 130,360 121,379 C116,388 106,389 101,383 C109,364 109,336 101,316 Z"),
      ],
   },
];

const BACK_MUSCLES: { id: MuscleId; shapes: MuscleShape[] }[] = [
   {
      id: "back",
      shapes: [
         p("M100,73 C108,73 118,78 128,88 C138,98 143,114 141,132 C139,150 132,166 120,176 C112,182 104,181 100.5,175 C104,166 105,152 103,138 C101,124 100,100 100,73 Z"),
         p("M100.5,180 C108,178 115,180 118,188 L115,201 C109,204 104,204 100.5,201 Z"),
      ],
   },
   {
      id: "shoulders",
      shapes: [
         p("M107,88 C124,85 144,89 157,102 C167,112 170,127 165,140 C161,135 154,131 147,132 C144,118 137,105 127,98 C120,93 113,90 107,94 Z"),
      ],
   },
   {
      id: "triceps",
      shapes: [
         p("M148,130 C157,126 166,129 171,139 C176,150 175,164 168,177 C163,184 154,185 149,179 C154,167 154,150 148,136 Z"),
         p("M151,182 C160,178 168,182 172,193 C176,207 173,225 165,239 C160,247 150,247 146,240 C153,225 156,205 151,190 Z"),
      ],
   },
   {
      id: "glutes",
      shapes: [
         p("M100.5,198 C111,194 123,195 129,203 C134,213 131,226 121,233 C113,238 103,237 100.5,232 Z"),
      ],
   },
   {
      id: "hamstrings",
      shapes: [
         p("M101,248 C112,246 123,249 128,258 C133,272 130,288 121,298 C115,304 106,303 101,296 C107,282 107,264 101,252 Z"),
      ],
   },
   {
      id: "calves",
      shapes: [
         p("M101,314 C112,311 124,313 129,324 C134,339 131,362 122,381 C117,390 106,391 101,385 C110,366 110,338 101,318 Z"),
      ],
   },
];

export const MuscleMap: React.FC<MuscleMapProps> = ({
   view,
   muscleColors,
   onMuscleClick,
   emptyColor = "#e5e7eb", // Колір м'яза без даних
}) => {
   // Унiкальний префiкс для id градiєнтiв — щоб компонент можна було
   // безпечно рендерити кiлька разiв на однiй сторiнцi (напр. front + back).
   const uid = useId().replace(/:/g, "");
   const lightId = `${uid}-relief-light`;
   const shadowId = `${uid}-relief-shadow`;

   const getColor = (id: MuscleId) => muscleColors[id] || emptyColor;

   // Один шар форми: базова заливка (клiкабельна) + два шари "рельєфу"
   // (блiк зверху-злiва i тiнь знизу-справа), якi додають об'єм незалежно
   // вiд того, який колір передали ззовнi.
   const renderShapeLayers = (shape: MuscleShape, fill: string, key: React.Key) => {
      const commonFill =
         shape.kind === "path" ? (
            <path
               d={shape.d}
               fill={fill}
               className="transition-all duration-300 stroke-black/20 group-hover:stroke-white group-hover:opacity-90"
               style={{ strokeWidth: 0.8 }}
            />
         ) : (
            <rect
               x={shape.x}
               y={shape.y}
               width={shape.width}
               height={shape.height}
               rx={shape.rx}
               fill={fill}
               className="transition-all duration-300 stroke-black/20 group-hover:stroke-white group-hover:opacity-90"
               style={{ strokeWidth: 0.8 }}
            />
         );

      const highlight =
         shape.kind === "path" ? (
            <path d={shape.d} fill={`url(#${lightId})`} className="pointer-events-none" />
         ) : (
            <rect
               x={shape.x}
               y={shape.y}
               width={shape.width}
               height={shape.height}
               rx={shape.rx}
               fill={`url(#${lightId})`}
               className="pointer-events-none"
            />
         );

      const shadow =
         shape.kind === "path" ? (
            <path d={shape.d} fill={`url(#${shadowId})`} className="pointer-events-none" />
         ) : (
            <rect
               x={shape.x}
               y={shape.y}
               width={shape.width}
               height={shape.height}
               rx={shape.rx}
               fill={`url(#${shadowId})`}
               className="pointer-events-none"
            />
         );

      return (
         <React.Fragment key={key}>
            {commonFill}
            {highlight}
            {shadow}
         </React.Fragment>
      );
   };

   // Рендерить одну групу м'язiв: праву сторону як намальовано + дзеркальну
   // копiю для лiвої. isStatic — для декоративних, неклiкабельних елементiв.
   const renderMuscleGroup = (
      id: MuscleId | null,
      shapes: MuscleShape[],
      isStatic: boolean = false,
   ) => {
      const fill = isStatic || !id ? BASE_COLOR : getColor(id);

      const interactiveProps = !isStatic && id
         ? {
            onClick: () => onMuscleClick(id),
            className: "group cursor-pointer outline-none",
         }
         : { className: "outline-none" };

      return (
         <g {...interactiveProps}>
            {shapes.map((shape, index) => (
               <React.Fragment key={index}>
                  {renderShapeLayers(shape, fill, `r-${index}`)}
                  <g transform="translate(200, 0) scale(-1, 1)">
                     {renderShapeLayers(shape, fill, `l-${index}`)}
                  </g>
               </React.Fragment>
            ))}
         </g>
      );
   };

   const muscleGroups = view === "front" ? FRONT_MUSCLES : BACK_MUSCLES;
   // Невеликий трикутник трапецiї мiж шиєю i плечима — суто декоративний.
   const trapConnector = "M100,72 L108,74 L127,88 C121,94 111,96 100,94 Z";

   return (
      <div className="flex justify-center items-center w-full max-w-[280px] sm:max-w-sm mx-auto p-4 bg-[#f8fafc] rounded-3xl border border-gray-200 shadow-inner">
         <svg
            viewBox="0 0 200 420"
            className="w-full h-auto max-h-[500px] select-none filter drop-shadow-md"
         >
            <defs>
               {/* Блiк зверху-злiва — iмiтує округлiсть накачаного м'яза */}
               <linearGradient id={lightId} x1="0.05" y1="0" x2="0.75" y2="0.9">
                  <stop offset="0" stopColor="#ffffff" stopOpacity="0.38" />
                  <stop offset="0.55" stopColor="#ffffff" stopOpacity="0" />
               </linearGradient>
               {/* Тiнь знизу-справа — додає глибини рельєфу */}
               <linearGradient id={shadowId} x1="0.25" y1="0.15" x2="1" y2="1">
                  <stop offset="0.45" stopColor="#000000" stopOpacity="0" />
                  <stop offset="1" stopColor="#000000" stopOpacity="0.30" />
               </linearGradient>
            </defs>

            {/*
               БАЗОВЕ ТІЛО (кістяк)
               Навмисно вужче за м'язи зверху — саме тому в проймах, на талії
               та мiж м'язами видно темнiший "кiстяк": це i створює ефект
               накачаного тiла, де м'язи виступають назовнi.
            */}
            <g
               id="base-body"
               fill={BASE_COLOR}
               stroke={BASE_COLOR}
               strokeWidth="2.5"
               strokeLinejoin="round"
               strokeLinecap="round"
            >
               {/* Голова */}
               <path d="M100,14 C90,14 83,24 83,38 C83,50 87,60 93,66 C95,69 95,72 94,76 L106,76 C105,72 105,69 107,66 C113,60 117,50 117,38 C117,24 110,14 100,14 Z" />
               {/* Шия */}
               <path d="M93,74 C96,80 96,85 94,89 L106,89 C104,85 104,80 107,74 Z" />
               {/* Торс (вузький орiєнтир, видно на талii) */}
               <path d="M94,87 C78,91 65,98 60,113 C56,126 58,145 63,162 C67,176 70,190 72,202 L128,202 C130,190 133,176 137,162 C142,145 144,126 140,113 C135,98 122,91 106,87 C102,92 98,92 94,87 Z" />
               {/* Таз */}
               <path d="M72,199 C80,193 120,193 128,199 C133,212 130,229 122,241 C112,248 88,248 78,241 C70,229 67,212 72,199 Z" />
               {/* Ліва рука (вузький орiєнтир) */}
               <path d="M61,110 C50,117 44,130 41,148 C38,168 35,188 31,206 C29,214 32,219 38,217 C45,213 49,195 53,175 C57,155 61,133 66,118 Z" />
               {/* Права рука */}
               <path d="M139,110 C150,117 156,130 159,148 C162,168 165,188 169,206 C171,214 168,219 162,217 C155,213 151,195 147,175 C143,155 139,133 134,118 Z" />
               {/* Кисті */}
               <path d="M27,208 C24,212 24,220 28,224 C33,227 39,225 40,219 C41,214 38,209 33,208 Z" />
               <path d="M173,208 C176,212 176,220 172,224 C167,227 161,225 160,219 C159,214 162,209 167,208 Z" />
               {/* Ліва нога */}
               <path d="M78,240 C74,268 73,298 76,328 C77,352 74,376 69,396 C74,404 88,404 92,396 L95,328 C97,298 97,268 92,240 Z" />
               {/* Права нога */}
               <path d="M122,240 C126,268 127,298 124,328 C123,352 126,376 131,396 C126,404 112,404 108,396 L105,328 C103,298 103,268 108,240 Z" />
               {/* Стопи */}
               <path d="M64,392 C56,399 55,408 67,410 L92,408 L92,396 Z" />
               <path d="M136,392 C144,399 145,408 133,410 L108,408 L108,396 Z" />
            </g>

            {/* М'ЯЗИ (Фронт або Тил) */}
            <g id={view === "front" ? "front-muscles" : "back-muscles"}>
               {renderMuscleGroup(null, [p(trapConnector)], true)}
               {muscleGroups.map((group) => (
                  <React.Fragment key={group.id}>
                     {renderMuscleGroup(group.id, group.shapes)}
                  </React.Fragment>
               ))}
            </g>
         </svg>
      </div>
   );
};