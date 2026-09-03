import React, { useState, useEffect } from "react";
import { useWeightFood } from "../../Hooks/useWeightFood";
import { getBmiColor } from "../../Utils/metricDisplayUtils";
import WeightChart from "../../Components/WeightFoodPage/WeightChart";
import { useLanguage } from "../../Context/LanguageContext";
import { POPULAR_EXERCISES } from "../../locales/PopularExercises/PopularExercises";
import { MuscleMap, type MuscleId } from "../../Components/WeightFoodPage/MuscleMap";

const MUSCLE_EXERCISES: Record<MuscleId, number[]> = {
   chest: [0, 24, 71],
   back: [5, 34, 33],
   shoulders: [3, 12, 22],
   biceps: [10, 6, 85],
   triceps: [8, 37],
   abs: [19, 20, 21],
   quads: [1, 14, 16],
   hamstrings: [2, 75],
   calves: [17, 78],
   glutes: [1, 2, 14],
};

type MuscleSet = { w: string; r: string }[];
type MuscleStats = Partial<Record<MuscleId, MuscleSet>>;

function computeMuscleScore(stats?: MuscleSet): number {
   if (!stats) return 0;

   const totalVolume = stats.reduce((acc, s) => {
      const w = parseFloat(s.w) || 0;
      const r = parseFloat(s.r) || 0;
      return acc + (w * r);
   }, 0);

   if (totalVolume === 0) return 0;

   const score = (Math.pow(totalVolume, 0.5) / 50) * 100;
   return Math.max(1, Math.min(100, score));
}

function scoreToColor(score: number): string {
   if (score <= 0) return "";
   const hue = (score / 100) * 120;
   return `hsl(${hue}, 85%, 55%)`;
}

interface IWeightFoodProps {
   selectedDate: Date;
}

export const WeightFood: React.FC<IWeightFoodProps> = ({ selectedDate }) => {
   const { t, language } = useLanguage() as { t: (key: string) => string; language?: "en" | "ru" | "uk" | "de" };

   const {
      morningWeight, setMorningWeight, eveningWeight, setEveningWeight,
      heightInput, setHeightInput, age, setAge, bmi, bmiCategory, bmr,
      message, unitPreferences, handleSaveMetrics,
   } = useWeightFood(selectedDate);

   const exerciseNames: string[] =
      POPULAR_EXERCISES[language ? language : "en"] ||
      POPULAR_EXERCISES.en;

   const [bodyView, setBodyView] = useState<"front" | "back">("front");
   const [selectedMuscle, setSelectedMuscle] = useState<MuscleId | null>(null);
   const [draftStats, setDraftStats] = useState<MuscleSet>([{ w: "", r: "" }, { w: "", r: "" }, { w: "", r: "" }]);
   const [muscleStats, setMuscleStats] = useState<MuscleStats>({});

   // Відновлення даних при зміні дати або завантаженні сторінки (з легким фолбеком на останнє збереження)
   useEffect(() => {
      const dateKey = selectedDate.toISOString().split("T")[0];

      // 1. Пряме збереження на вибрану дату
      const saved = localStorage.getItem(`muscleStats_${dateKey}`);
      if (saved) {
         try {
            setMuscleStats(JSON.parse(saved));
            return;
         } catch (e) {
            // Якщо збереження пошкоджене, продовжуємо пошук
         }
      }

      // 2. Пошук збережень до цієї дати включно
      const keys: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
         const key = localStorage.key(i);
         if (key && key.startsWith("muscleStats_")) {
            keys.push(key);
         }
      }

      if (keys.length > 0) {
         const dates = keys.map((k) => k.replace("muscleStats_", ""));
         // Сортуємо дати за спаданням (від найновіших до найдавніших)
         const pastOrCurrentDates = dates
            .filter((d) => d <= dateKey)
            .sort((a, b) => b.localeCompare(a));

         if (pastOrCurrentDates.length > 0) {
            const latestSaved = localStorage.getItem(`muscleStats_${pastOrCurrentDates[0]}`);
            if (latestSaved) {
               try {
                  setMuscleStats(JSON.parse(latestSaved));
                  return;
               } catch (e) {
                  // Провал парсингу
               }
            }
         }

         // Фолбек: якщо не знайшли збережень до цієї дати, беремо найновіше взагалі
         const allDatesSorted = dates.sort((a, b) => b.localeCompare(a));
         const latestSavedAny = localStorage.getItem(`muscleStats_${allDatesSorted[0]}`);
         if (latestSavedAny) {
            try {
               setMuscleStats(JSON.parse(latestSavedAny));
               return;
            } catch (e) {
               // Провал парсингу
            }
         }
      }

      setMuscleStats({});
   }, [selectedDate]);

   const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-brand-border rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";
   const cardClasses = "p-4 bg-gray-50 rounded-lg shadow-sm border border-brand-border";

   const muscleLabel = (id: MuscleId) => t(`muscle_${id}`) || id;

   const handleMuscleClick = (id: MuscleId) => {
      setSelectedMuscle(id);
      setDraftStats(muscleStats[id] || [{ w: "", r: "" }, { w: "", r: "" }, { w: "", r: "" }]);
   };

   const updateDraftStat = (index: number, field: "w" | "r", value: string) => {
      setDraftStats((prev) => {
         const next = [...prev];
         next[index] = { ...next[index], [field]: value };
         return next;
      });
   };

   const saveMuscleData = () => {
      if (!selectedMuscle) return;

      const dateKey = selectedDate.toISOString().split("T")[0];
      const updatedStats = { ...muscleStats, [selectedMuscle]: draftStats };

      setMuscleStats(updatedStats);
      localStorage.setItem(`muscleStats_${dateKey}`, JSON.stringify(updatedStats));
      setSelectedMuscle(null);
   };

   const currentMuscleColors: Record<string, string> = {};
   Object.keys(MUSCLE_EXERCISES).forEach((key) => {
      const score = computeMuscleScore(muscleStats[key as MuscleId]);
      if (score > 0) currentMuscleColors[key] = scoreToColor(score);
   });

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
                        {bmi} <span className="text-sm font-normal">({t(`bmi_${bmiCategory.toLowerCase()}`)})</span>
                     </p>
                  ) : (
                     <p className="text-gray-500">{t("enter_weight_and_height")}</p>
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

         <div className="mt-10 border-t border-brand-border pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
               <h2 className="text-lg sm:text-xl font-semibold text-brand-green-dark">
                  {t("muscle_map_title") || "Розвиток м'язів"}
               </h2>

               <div className="flex bg-gray-100 p-1 rounded-lg w-full sm:w-auto">
                  <button
                     type="button"
                     onClick={() => setBodyView("front")}
                     className={`flex-1 sm:flex-none sm:px-6 py-2 rounded-md text-sm font-semibold transition-all ${bodyView === "front" ? "bg-white shadow text-brand-green-dark" : "text-gray-500 hover:text-gray-700"}`}
                  >
                     {t("front_view") || "Спереду"}
                  </button>
                  <button
                     type="button"
                     onClick={() => setBodyView("back")}
                     className={`flex-1 sm:flex-none sm:px-6 py-2 rounded-md text-sm font-semibold transition-all ${bodyView === "back" ? "bg-white shadow text-brand-green-dark" : "text-gray-500 hover:text-gray-700"}`}
                  >
                     {t("back_view") || "Ззаду"}
                  </button>
               </div>
            </div>

            <MuscleMap
               view={bodyView}
               muscleColors={currentMuscleColors}
               onMuscleClick={handleMuscleClick}
            />

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 mt-6 w-full px-4 max-w-lg mx-auto">
               <div className="flex items-center gap-2 text-sm text-gray-500 font-medium">
                  <div className="w-5 h-5 rounded bg-[#e2e8f0] border border-gray-300" />
                  <span>{t("no_data") || "Немає даних"}</span>
               </div>

               <div className="flex flex-col sm:flex-row items-stretch sm:items-center w-full sm:w-auto gap-2">
                  <div className="flex justify-between items-center sm:gap-3 text-sm text-gray-500 font-medium">
                     <span>{t("low") || "Слабо"}</span>
                     <div className="hidden sm:block w-40 h-3 rounded-full" style={{ background: "linear-gradient(90deg, hsl(0,85%,55%), hsl(50,85%,55%), hsl(120,85%,55%))" }} />
                     <span>{t("high") || "Розвинено"}</span>
                  </div>
                  <div className="sm:hidden w-full h-3 rounded-full mt-1" style={{ background: "linear-gradient(90deg, hsl(0,85%,55%), hsl(50,85%,55%), hsl(120,85%,55%))" }} />
               </div>
            </div>
         </div>

         {selectedMuscle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
               <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-5 sm:p-7 max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-xl sm:text-2xl font-bold text-brand-green-dark capitalize">
                        {muscleLabel(selectedMuscle)}
                     </h3>
                     <button type="button" onClick={() => setSelectedMuscle(null)} className="text-gray-400 hover:text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center transition-colors">
                        ✕
                     </button>
                  </div>

                  <div className="space-y-4">
                     {MUSCLE_EXERCISES[selectedMuscle].map((exerciseIndex, i) => (
                        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100 shadow-sm">
                           <p className="font-semibold text-gray-800 mb-3">
                              {exerciseNames[exerciseIndex]}
                           </p>
                           <div className="flex gap-4">
                              <div className="flex-1">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">{t("weight") || "Вага"} ({unitPreferences.weight.toUpperCase()})</label>
                                 <input
                                    type="number" inputMode="decimal"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white transition-shadow"
                                    placeholder={unitPreferences.weight === "kg" ? "20" : "45"}
                                    value={draftStats[i]?.w || ""}
                                    onChange={(e) => updateDraftStat(i, "w", e.target.value)}
                                 />
                              </div>
                              <div className="flex-1">
                                 <label className="block text-xs font-medium text-gray-500 mb-1">{t("reps") || "Повтори"}</label>
                                 <input
                                    type="number" inputMode="numeric"
                                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-green outline-none bg-white transition-shadow"
                                    placeholder="12"
                                    value={draftStats[i]?.r || ""}
                                    onChange={(e) => updateDraftStat(i, "r", e.target.value)}
                                 />
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>

                  <button
                     type="button"
                     onClick={saveMuscleData}
                     className="w-full mt-8 bg-brand-green text-white font-bold py-3 rounded-xl hover:bg-brand-green-dark transition-colors shadow-md"
                  >
                     {t("save_progress") || "Зберегти"}
                  </button>
               </div>
            </div>
         )}
      </div>
   );
};