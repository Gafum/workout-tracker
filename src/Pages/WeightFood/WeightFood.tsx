import React, { useState } from "react";
import { useWeightFood } from "../../Hooks/useWeightFood";
import { getBmiColor } from "../../Utils/metricDisplayUtils";
import WeightChart from "../../Components/WeightChart/WeightChart";
import { useLanguage } from "../../Context/LanguageContext";

export const en_POPULAR_EXERCISES: string[] = [
   "Bench Press", "Squat", "Deadlift", "Overhead Press", "Barbell Row", "Pull Up", "Chin Up", "Push Up", "Dip", "Lunge",
   "Bicep Curl", "Triceps Extension", "Lateral Raise", "Front Raise", "Leg Press", "Leg Curl", "Leg Extension", "Calf Raise",
   "Plank", "Crunch", "Russian Twist", "Hanging Leg Raise", "Face Pull", "Dumbbell Bench Press", "Incline Dumbbell Press",
   "Dumbbell Row", "One Arm Dumbbell Row", "Dumbbell Shoulder Press", "Arnold Press", "Goblet Squat", "Romanian Deadlift",
   "Good Morning", "Hip Thrust", "Seated Cable Row", "Lat Pulldown", "Cable Crossover", "Pec Deck Fly", "Triceps Pushdown",
   "Overhead Triceps Extension", "Hammer Curl", "Concentration Curl", "Preacher Curl", "Skullcrusher", "Close Grip Bench Press",
   "Reverse Fly", "Shrug", "Upright Row", "Clean and Jerk", "Snatch", "Kettlebell Swing", "Turkish Get Up", "Box Jump", "Burpee",
   "Mountain Climber", "Battle Ropes", "Sled Push", "Farmer's Walk", "T-Bar Row", "Pendlay Row", "Sumo Deadlift", "Front Squat",
   "Hack Squat", "Split Squat", "Bulgarian Split Squat", "Glute Bridge", "Ab Wheel Rollout", "Side Plank", "Bicycle Crunch",
   "Reverse Crunch", "Cable Woodchopper", "Pallof Press", "Machine Chest Press", "Machine Shoulder Press", "Machine Row",
   "Machine Fly", "Hyperextension", "Reverse Hyperextension", "Nordic Hamstring Curl", "Seated Calf Raise", "Donkey Calf Raise",
   "Incline Bench Press", "Decline Bench Press", "Dumbbell Fly", "Cable Lateral Raise", "Cable Front Raise", "Barbell Curl",
   "EZ Bar Curl", "Reverse Curl", "Wrist Curl", "Reverse Wrist Curl", "Standing Calf Raise", "Leg Abduction", "Leg Adduction",
   "Stair Master", "Elliptical Trainer", "Treadmill Run", "Cycling", "Rowing Machine"
];

const MUSCLE_EXERCISES: Record<string, number[]> = {
   chest: [0, 24, 70], // Bench Press, Incline Dumbbell Press, Machine Chest Press
   back: [5, 4, 34], // Pull Up, Barbell Row, Lat Pulldown
   shoulders: [3, 12, 22], // Overhead Press, Lateral Raise, Face Pull
   biceps: [10, 39, 41], // Bicep Curl, Hammer Curl, Preacher Curl
   triceps: [11, 8, 37], // Triceps Extension, Dip, Triceps Pushdown
   abs: [18, 19, 21], // Plank, Crunch, Hanging Leg Raise
   quads: [1, 14, 59], // Squat, Leg Press, Front Squat
   hamstrings: [30, 15, 77], // Romanian Deadlift, Leg Curl, Nordic Hamstring Curl
   calves: [17, 78, 79], // Calf Raise, Seated Calf Raise, Donkey Calf Raise
   glutes: [32, 64, 9] // Hip Thrust, Glute Bridge, Lunge
};

interface IWeightFoodProps {
   selectedDate: Date;
}

export const WeightFood: React.FC<IWeightFoodProps> = ({ selectedDate }) => {
   const { t } = useLanguage();
   const {
      morningWeight, setMorningWeight, eveningWeight, setEveningWeight,
      heightInput, setHeightInput, age, setAge, bmi, bmiCategory, bmr,
      message, unitPreferences, handleSaveMetrics,
   } = useWeightFood(selectedDate);

   const [bodyView, setBodyView] = useState<"front" | "back">("front");
   const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
   const [muscleStats, setMuscleStats] = useState<Record<string, { w: string; r: string }[]>>({});

   const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-brand-border rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";
   const cardClasses = "p-4 bg-gray-50 rounded-lg shadow-sm border border-brand-border";

   const handleMuscleClick = (muscle: string) => {
      setSelectedMuscle(muscle);
   };

   const saveMuscleData = () => {
      setSelectedMuscle(null);
   };

   const updateMuscleStat = (index: number, field: "w" | "r", value: string) => {
      if (!selectedMuscle) return;
      const current = muscleStats[selectedMuscle] || [{ w: "", r: "" }, { w: "", r: "" }, { w: "", r: "" }];
      const updated = [...current];
      updated[index] = { ...updated[index], [field]: value };
      setMuscleStats({ ...muscleStats, [selectedMuscle]: updated });
   };

   const getMuscleColor = (muscle: string) => {
      const stats = muscleStats[muscle];
      if (!stats) return "#f3f4f6";

      let score = 0;
      stats.forEach(s => {
         const w = parseFloat(s.w) || 0;
         const r = parseFloat(s.r) || 0;
         score += (w * r) / 20;
      });

      if (score === 0) return "#f3f4f6"; // Gray
      if (score < 30) return "#fca5a5"; // Red
      if (score < 70) return "#fde047"; // Yellow
      return "#86efac"; // Green
   };

   const renderMusclePath = (id: string, d: string, label: string) => (
      <path
         d={d}
         fill={getMuscleColor(id)}
         stroke="#cbd5e1"
         strokeWidth="2"
         className="cursor-pointer hover:opacity-70 transition-all duration-300"
         onClick={() => handleMuscleClick(id)}
      >
         <title>{t(`muscle_${id}` as any) || label}</title>
      </path>
   );

   return (
      <div className="p-4 bg-white rounded-lg shadow-sm border border-brand-border min-h-[300px]">
         <h2 className="text-xl font-semibold text-brand-green-dark mb-6">
            {t("daily_metrics")}
         </h2>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
               <div>
                  <label htmlFor="morningWeight" className="block text-sm font-medium text-gray-700">
                     {t("morning_weight")} ({unitPreferences.weight.toUpperCase()})
                  </label>
                  <input
                     type="number" id="morningWeight" value={morningWeight}
                     onChange={(e) => setMorningWeight(e.target.value)} onBlur={handleSaveMetrics}
                     className={inputClasses} placeholder={`e.g., ${unitPreferences.weight === "kg" ? "70.5" : "155.5"}`}
                     step="0.1" min="0"
                  />
               </div>

               <div>
                  <label htmlFor="eveningWeight" className="block text-sm font-medium text-gray-700">
                     {t("evening_weight")} ({unitPreferences.weight.toUpperCase()})
                  </label>
                  <input
                     type="number" id="eveningWeight" value={eveningWeight}
                     onChange={(e) => setEveningWeight(e.target.value)} onBlur={handleSaveMetrics}
                     className={inputClasses} placeholder={`e.g., ${unitPreferences.weight === "kg" ? "71.2" : "157.0"}`}
                     step="0.1" min="0"
                  />
               </div>

               <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700">
                     {t("height")} ({unitPreferences.height === "ft/in" ? "IN" : unitPreferences.height.toUpperCase()})
                  </label>
                  <input
                     type="number" id="height" value={heightInput}
                     onChange={(e) => setHeightInput(e.target.value)} onBlur={handleSaveMetrics}
                     className={inputClasses} placeholder={`e.g., ${unitPreferences.height === "cm" ? "175" : "69"}`}
                     step={unitPreferences.height === "cm" ? "1" : "0.1"} min="0"
                  />
               </div>

               <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                     {t("age")}
                  </label>
                  <input
                     type="number" id="age" value={age}
                     onChange={(e) => setAge(e.target.value)} onBlur={handleSaveMetrics}
                     className={inputClasses} placeholder="e.g., 25" min="0"
                  />
               </div>
            </div>

            <div className="space-y-4">
               <div className={cardClasses}>
                  <h3 className="text-lg font-medium text-brand-green-dark mb-2">{t("bmi")}</h3>
                  {bmi !== null ? (
                     <p className={`text-2xl font-bold ${getBmiColor(bmiCategory)}`}>
                        {bmi} <span className="text-sm font-normal">({t(`bmi_${bmiCategory.toLowerCase()}` as any)})</span>
                     </p>
                  ) : (
                     <p className="text-gray-500">{t("enter_weight_and_height" as any)}</p>
                  )}
               </div>

               <div className={cardClasses}>
                  <h3 className="text-lg font-medium text-brand-green-dark mb-2">{t("bmr")}</h3>
                  {bmr !== null ? (
                     <p className="text-2xl font-bold text-gray-700">
                        {bmr} <span className="text-sm font-normal">{t("kcal_per_day")}</span>
                     </p>
                  ) : (
                     <p className="text-gray-500">{t("enter_weight_height_age")}</p>
                  )}
               </div>
            </div>
         </div>

         {message && <p className="text-sm text-green-600 mb-4 text-center">{message}</p>}
         <WeightChart unitPreferences={unitPreferences} currentMorningWeight={morningWeight?.toString() ?? null} currentEveningWeight={eveningWeight?.toString() ?? null} selectedDate={selectedDate} />

         {/* MUSCLE MAP SECTION */}
         <div className="mt-10 border-t border-brand-border pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
               <h2 className="text-xl font-semibold text-brand-green-dark mb-4 sm:mb-0">
                  {t("muscle_map_title" as any) || "Muscle Development"}
               </h2>
               <div className="flex bg-gray-100 p-1 rounded-lg">
                  <button
                     onClick={() => setBodyView("front")}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${bodyView === "front" ? "bg-white shadow text-brand-green-dark" : "text-gray-500 hover:text-gray-700"}`}
                  >
                     {t("front_view" as any) || "Front"}
                  </button>
                  <button
                     onClick={() => setBodyView("back")}
                     className={`px-4 py-1.5 rounded-md text-sm font-medium transition-colors ${bodyView === "back" ? "bg-white shadow text-brand-green-dark" : "text-gray-500 hover:text-gray-700"}`}
                  >
                     {t("back_view" as any) || "Back"}
                  </button>
               </div>
            </div>

            <div className="flex justify-center items-center w-full max-w-sm mx-auto p-4 bg-gray-50 rounded-xl border border-gray-200">
               <svg viewBox="0 0 200 400" className="w-full h-auto max-h-[500px]">
                  {bodyView === "front" ? (
                     <g id="front-body">
                        {/* Head & Neck (Static) */}
                        <circle cx="100" cy="40" r="25" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />
                        <path d="M 90 65 L 110 65 L 115 80 L 85 80 Z" fill="#e2e8f0" />

                        {/* Chest */}
                        {renderMusclePath("chest", "M 75 80 L 125 80 Q 130 110 100 120 Q 70 110 75 80 Z", "Chest")}

                        {/* Abs */}
                        {renderMusclePath("abs", "M 82 122 L 118 122 Q 122 170 100 185 Q 78 170 82 122 Z", "Abs")}

                        {/* Shoulders */}
                        {renderMusclePath("shoulders", "M 75 80 Q 55 80 50 110 L 68 115 Z", "Left Shoulder")}
                        {renderMusclePath("shoulders", "M 125 80 Q 145 80 150 110 L 132 115 Z", "Right Shoulder")}

                        {/* Biceps */}
                        {renderMusclePath("biceps", "M 50 112 Q 40 140 45 160 L 65 155 Q 70 130 68 117 Z", "Left Bicep")}
                        {renderMusclePath("biceps", "M 150 112 Q 160 140 155 160 L 135 155 Q 130 130 132 117 Z", "Right Bicep")}

                        {/* Forearms */}
                        {renderMusclePath("biceps", "M 44 162 Q 35 200 30 210 L 45 210 Q 55 180 63 158 Z", "Left Forearm")}
                        {renderMusclePath("biceps", "M 156 162 Q 165 200 170 210 L 155 210 Q 145 180 137 158 Z", "Right Forearm")}

                        {/* Quads */}
                        {renderMusclePath("quads", "M 78 187 L 98 187 L 95 270 Q 80 270 70 260 Z", "Left Quad")}
                        {renderMusclePath("quads", "M 102 187 L 122 187 L 130 260 Q 120 270 105 270 Z", "Right Quad")}

                        {/* Calves (Front visible part) */}
                        {renderMusclePath("calves", "M 70 275 L 94 275 Q 90 320 85 360 L 75 360 Q 65 310 70 275 Z", "Left Calf")}
                        {renderMusclePath("calves", "M 106 275 L 130 275 Q 135 310 125 360 L 115 360 Q 110 320 106 275 Z", "Right Calf")}
                     </g>
                  ) : (
                     <g id="back-body">
                        {/* Head & Neck */}
                        <circle cx="100" cy="40" r="25" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="2" />

                        {/* Traps */}
                        {renderMusclePath("back", "M 85 60 L 115 60 L 125 90 L 100 110 L 75 90 Z", "Traps / Upper Back")}

                        {/* Lats & Lower Back */}
                        {renderMusclePath("back", "M 75 92 L 125 92 Q 135 140 100 175 Q 65 140 75 92 Z", "Lats / Lower Back")}

                        {/* Shoulders (Rear) */}
                        {renderMusclePath("shoulders", "M 73 85 Q 55 80 50 110 L 68 115 Z", "Left Rear Delt")}
                        {renderMusclePath("shoulders", "M 127 85 Q 145 80 150 110 L 132 115 Z", "Right Rear Delt")}

                        {/* Triceps */}
                        {renderMusclePath("triceps", "M 50 112 Q 40 140 45 160 L 65 155 Q 70 130 68 117 Z", "Left Tricep")}
                        {renderMusclePath("triceps", "M 150 112 Q 160 140 155 160 L 135 155 Q 130 130 132 117 Z", "Right Tricep")}

                        {/* Forearms (Rear) */}
                        {renderMusclePath("triceps", "M 44 162 Q 35 200 30 210 L 45 210 Q 55 180 63 158 Z", "Left Forearm")}
                        {renderMusclePath("triceps", "M 156 162 Q 165 200 170 210 L 155 210 Q 145 180 137 158 Z", "Right Forearm")}

                        {/* Glutes */}
                        {renderMusclePath("glutes", "M 75 177 L 125 177 Q 135 210 100 220 Q 65 210 75 177 Z", "Glutes")}

                        {/* Hamstrings */}
                        {renderMusclePath("hamstrings", "M 70 222 Q 95 220 95 270 Q 80 270 70 260 Z", "Left Hamstring")}
                        {renderMusclePath("hamstrings", "M 130 222 Q 105 220 105 270 Q 120 270 130 260 Z", "Right Hamstring")}

                        {/* Calves (Rear) */}
                        {renderMusclePath("calves", "M 70 275 L 94 275 Q 90 320 85 360 L 75 360 Q 65 310 70 275 Z", "Left Calf")}
                        {renderMusclePath("calves", "M 106 275 L 130 275 Q 135 310 125 360 L 115 360 Q 110 320 106 275 Z", "Right Calf")}
                     </g>
                  )}
               </svg>
            </div>

            <div className="flex justify-center gap-4 mt-4 text-xs text-gray-500">
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#f3f4f6]"></div> {t("None" as any) || "None"}</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#fca5a5]"></div> {t("Low" as any) || "Low"}</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#fde047]"></div> {t("Med" as any) || "Med"}</div>
               <div className="flex items-center gap-1"><div className="w-3 h-3 rounded-full bg-[#86efac]"></div> {t("High" as any) || "High"}</div>
            </div>
         </div>

         {/* MODAL */}
         {selectedMuscle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
               <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                     <h3 className="text-xl font-bold text-brand-green-dark capitalize">
                        {t(`muscle_${selectedMuscle}` as any) || selectedMuscle} Exercises
                     </h3>
                     <button onClick={() => setSelectedMuscle(null)} className="text-gray-400 hover:text-gray-600">
                        ✕
                     </button>
                  </div>

                  <div className="space-y-6">
                     {(MUSCLE_EXERCISES[selectedMuscle] || []).slice(0, 3).map((exerciseIndex, i) => {
                        const currentStats = muscleStats[selectedMuscle] || [{ w: "", r: "" }, { w: "", r: "" }, { w: "", r: "" }];
                        return (
                           <div key={i} className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                              <p className="font-medium text-sm text-gray-700 mb-2">
                                 {en_POPULAR_EXERCISES[exerciseIndex]}
                              </p>
                              <div className="flex gap-4">
                                 <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">{t("weight" as any) || "Weight"}</label>
                                    <input
                                       type="number"
                                       className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-brand-green outline-none"
                                       placeholder="kg"
                                       value={currentStats[i]?.w || ""}
                                       onChange={(e) => updateMuscleStat(i, "w", e.target.value)}
                                    />
                                 </div>
                                 <div className="flex-1">
                                    <label className="block text-xs text-gray-500 mb-1">{t("reps" as any) || "Reps"}</label>
                                    <input
                                       type="number"
                                       className="w-full px-2 py-1.5 text-sm border rounded focus:ring-1 focus:ring-brand-green outline-none"
                                       placeholder="12"
                                       value={currentStats[i]?.r || ""}
                                       onChange={(e) => updateMuscleStat(i, "r", e.target.value)}
                                    />
                                 </div>
                              </div>
                           </div>
                        );
                     })}
                  </div>

                  <button
                     onClick={saveMuscleData}
                     className="w-full mt-6 bg-brand-green text-white font-medium py-2 rounded-lg hover:bg-brand-green-dark transition-colors"
                  >
                     {t("save_progress" as any) || "Save"}
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};