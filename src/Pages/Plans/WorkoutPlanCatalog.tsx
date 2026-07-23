import React, { useMemo, useState } from "react";
import { useLanguage } from "../../Context/LanguageContext";
import { POPULAR_EXERCISES } from "../../locales/PopularExercises/PopularExercises";
import { IWorkoutPlan, IPlanExercise } from "../../Types/plan";
import { PRESET_WORKOUT_PLANS } from "../../constants/presetPlans";
import { useAppContext } from "../../Context/AppContext";

const createEmptyPlan = (): IWorkoutPlan => ({
   id: `custom-${Date.now()}`,
   titleKey: "New Custom Plan",
   descriptionKey: "Build a custom training plan with your favorite exercises.",
   categoryKey: "plans.category.custom",
   isCustom: true,
   days: [
      {
         dayId: `custom-day-1`,
         dayNameKey: "Day 1",
         exercises: [],
      },
   ],
});

const formatPlanTitle = (plan: IWorkoutPlan, t: (key: string) => string) =>
   plan.titleKey.startsWith("plans.") ? t(plan.titleKey) : plan.titleKey;

export const WorkoutPlanCatalog: React.FC = () => {
   const { t, language } = useLanguage();
   const {
      activePlanId,
      setActivePlanId,
      customPlans,
      saveCustomPlans: onSaveCustomPlans,
   } = useAppContext();

   const exerciseNames =
      POPULAR_EXERCISES[language as keyof typeof POPULAR_EXERCISES] ||
      POPULAR_EXERCISES.en;

   const allPlans = useMemo(
      () => [...PRESET_WORKOUT_PLANS, ...customPlans],
      [customPlans]
   );

   // Зберігаємо IDs відкритих акордеонів
   const [expandedPlanIds, setExpandedPlanIds] = useState<string[]>([]);
   const [draftPlan, setDraftPlan] = useState<IWorkoutPlan>(createEmptyPlan());
   const [isEditing, setIsEditing] = useState(false);

   // Відкрити/закрити детальну інформацію про план (Dropdown/Accordion)
   const toggleExpandPlan = (planId: string) => {
      setExpandedPlanIds((prev) =>
         prev.includes(planId)
            ? prev.filter((id) => id !== planId)
            : [...prev, planId]
      );
   };

   // Активація / Деактивація плану
   const handleToggleActivePlan = (planId: string) => {
      if (activePlanId === planId) {
         setActivePlanId(null); // Деактивувати
      } else {
         setActivePlanId(planId); // Активувати
      }
   };

   const handleAddDay = () => {
      setDraftPlan((previous) => ({
         ...previous,
         days: [
            ...previous.days,
            {
               dayId: `custom-day-${previous.days.length + 1}`,
               dayNameKey: `Day ${previous.days.length + 1}`,
               exercises: [],
            },
         ],
      }));
   };

   const handleRemoveDay = (dayId: string) => {
      setDraftPlan((previous) => ({
         ...previous,
         days: previous.days.filter((day) => day.dayId !== dayId),
      }));
   };

   const handleAddExercise = (dayId: string) => {
      setDraftPlan((previous) => ({
         ...previous,
         days: previous.days.map((day) =>
            day.dayId === dayId
               ? {
                  ...day,
                  exercises: [
                     ...day.exercises,
                     {
                        exerciseIndex: 0,
                        sets: 3,
                        reps: "8-10",
                        defaultWeight: undefined,
                        proTipKey: "",
                     },
                  ],
               }
               : day
         ),
      }));
   };

   const handleUpdateExercise = (
      dayId: string,
      exerciseIndex: number,
      field: keyof IPlanExercise,
      value: string | number
   ) => {
      setDraftPlan((previous) => ({
         ...previous,
         days: previous.days.map((day) =>
            day.dayId === dayId
               ? {
                  ...day,
                  exercises: day.exercises.map((exercise, index) =>
                     index === exerciseIndex
                        ? {
                           ...exercise,
                           [field]: field === "sets" ? Number(value) : value,
                        }
                        : exercise
                  ),
               }
               : day
         ),
      }));
   };

   const handleRemoveExercise = (dayId: string, index: number) => {
      setDraftPlan((previous) => ({
         ...previous,
         days: previous.days.map((day) =>
            day.dayId === dayId
               ? {
                  ...day,
                  exercises: day.exercises.filter(
                     (_, exerciseIndex) => exerciseIndex !== index
                  ),
               }
               : day
         ),
      }));
   };

   const handleSaveDraft = () => {
      const nextPlan = {
         ...draftPlan,
         id: draftPlan.id || `custom-${Date.now()}`,
         titleKey: draftPlan.titleKey || "Custom Plan",
         descriptionKey:
            draftPlan.descriptionKey || "Custom plan built for your training split.",
         categoryKey: draftPlan.categoryKey || "plans.category.custom",
         isCustom: true,
         days: draftPlan.days.map((day, index) => ({
            ...day,
            dayNameKey: day.dayNameKey || `Day ${index + 1}`,
         })),
      };

      const existingPlanIndex = customPlans.findIndex((plan) => plan.id === nextPlan.id);
      const nextPlans = [...customPlans];

      if (existingPlanIndex >= 0) {
         nextPlans[existingPlanIndex] = nextPlan;
      } else {
         nextPlans.push(nextPlan);
      }

      onSaveCustomPlans(nextPlans);
      setIsEditing(false);
      setDraftPlan(createEmptyPlan());

      // Автоматично розгортаємо збережений план
      if (!expandedPlanIds.includes(nextPlan.id)) {
         setExpandedPlanIds((prev) => [...prev, nextPlan.id]);
      }
   };

   const handleEditCustomPlan = (plan: IWorkoutPlan) => {
      setDraftPlan(plan);
      setIsEditing(true);
      // Скролл до форми редагування
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
   };

   const handleDeleteCustomPlan = (planId: string) => {
      const filteredPlans = customPlans.filter((plan) => plan.id !== planId);
      onSaveCustomPlans(filteredPlans);
   };

   return (
      <div className="space-y-6 py-2">
         {/* Page header */}
         <div className="mb-2">
            <h1 className="text-2xl font-bold text-brand-text">{t("plans.catalog_title")}</h1>
            <p className="mt-1 text-sm text-gray-500">{t("plans.catalog_subtitle")}</p>
         </div>

         <div className="space-y-4">
            {allPlans.map((plan) => {
               const isActive = plan.id === activePlanId;
               const isExpanded = expandedPlanIds.includes(plan.id);

               return (
                  <article
                     key={plan.id}
                     className={`rounded-xl border bg-white transition shadow-sm ${isActive ? "border-brand-green ring-1 ring-brand-green/30" : "border-gray-200"
                        }`}
                  >
                     <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
                        <div
                           className="flex-1 cursor-pointer"
                           onClick={() => toggleExpandPlan(plan.id)}
                        >
                           <div className="flex items-center gap-2">
                              <h2 className="text-lg font-semibold text-brand-text">
                                 {formatPlanTitle(plan, t)}
                              </h2>
                              {plan.isCustom && (
                                 <span className="rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                                    {t("plans.custom_badge")}
                                 </span>
                              )}
                           </div>
                           <p className="mt-1 text-sm text-gray-500">
                              {plan.categoryKey ? t(plan.categoryKey) : t("plans.category.custom")}
                           </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                           <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                              {plan.days.length} {t("plans.days")}
                           </span>

                           <button
                              type="button"
                              onClick={() => handleToggleActivePlan(plan.id)}
                              title={isActive ? t("plans.active_label") : t("plans.set_active_plan")}
                              className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive
                                 ? "bg-brand-green text-white hover:bg-red-600"
                                 : "bg-gray-100 text-gray-700 hover:bg-brand-green hover:text-white"
                                 }`}
                           >
                              {isActive ? (
                                 <>
                                    {/* Іконка Активного стану / Вимкнення */}
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    <span>{t("plans.active_label")}</span>
                                 </>
                              ) : (
                                 <>
                                    {/* Іконка Деактивованого стану / Увімкнення */}
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                    </svg>
                                    <span>{t("plans.set_active_plan")}</span>
                                 </>
                              )}
                           </button>

                           {plan.isCustom && (
                              <div className="flex items-center gap-1">
                                 <button
                                    type="button"
                                    onClick={() => handleEditCustomPlan(plan)}
                                    className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-brand-green"
                                    title={t("plans.edit_custom_plan")}
                                 >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                    </svg>
                                 </button>
                                 <button
                                    type="button"
                                    onClick={() => handleDeleteCustomPlan(plan.id)}
                                    className="rounded-lg p-2 text-red-500 hover:bg-red-50"
                                    title={t("plans.delete_custom_plan")}
                                 >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                 </button>
                              </div>
                           )}

                           <button
                              type="button"
                              onClick={() => toggleExpandPlan(plan.id)}
                              className="hidden sm:block rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                           >
                              <svg
                                 className={`h-5 w-5 transform transition-transform ${isExpanded ? "rotate-180" : ""}`}
                                 fill="none"
                                 stroke="currentColor"
                                 viewBox="0 0 24 24"
                              >
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                              </svg>
                           </button>
                        </div>
                     </div>

                     {isExpanded && (
                        <div className="border-t border-gray-100 bg-gray-50/50 p-4 sm:p-5">
                           <div className="grid gap-4">
                              {plan.days.map((day) => (
                                 <div key={day.dayId} className="rounded-xl border border-gray-200 bg-white p-4">
                                    <h3 className="font-semibold text-brand-text">
                                       {t(day.dayNameKey)}
                                    </h3>
                                    <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                       {day.exercises.map((exercise, index) => (
                                          <li key={`${day.dayId}-${index}`} className="rounded-lg bg-gray-50 p-2.5">
                                             <div className="flex items-center justify-between gap-2">
                                                <span className="font-medium text-brand-text">
                                                   {exerciseNames[exercise.exerciseIndex] || `Exercise ${exercise.exerciseIndex}`}
                                                </span>
                                                <span className="text-xs font-semibold text-gray-500">
                                                   {exercise.sets}x {exercise.reps}
                                                </span>
                                             </div>
                                             {(exercise.defaultWeight !== undefined || exercise.proTipKey) && (
                                                <div className="mt-1 flex flex-wrap gap-2 text-xs text-gray-500">
                                                   {exercise.defaultWeight !== undefined && (
                                                      <span>{t("plans.standard_weight")}: {exercise.defaultWeight}</span>
                                                   )}
                                                   {exercise.proTipKey && <span>{t(exercise.proTipKey)}</span>}
                                                </div>
                                             )}
                                          </li>
                                       ))}
                                       {day.exercises.length === 0 && (
                                          <li className="text-xs text-gray-400 italic">
                                             {t("plans.no_exercises_in_day")}
                                          </li>
                                       )}
                                    </ul>
                                 </div>
                              ))}
                           </div>
                        </div>
                     )}
                  </article>
               );
            })}
         </div>

         <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="flex items-center justify-between">
               <div>
                  <h2 className="text-xl font-semibold text-brand-text">
                     {isEditing ? t("plans.editing_custom_plan") : t("plans.custom_plan_builder")}
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                     {t("plans.custom_plan_builder_description")}
                  </p>
               </div>
               {isEditing && (
                  <button
                     type="button"
                     onClick={() => {
                        setIsEditing(false);
                        setDraftPlan(createEmptyPlan());
                     }}
                     className="text-sm text-gray-500 hover:text-gray-700"
                  >
                     {t("cancel")}
                  </button>
               )}
            </div>

            <div className="mt-5 space-y-4">
               <div>
                  <label className="block text-sm font-medium text-gray-700">
                     {t("plans.custom_plan_title")}
                  </label>
                  <input
                     type="text"
                     value={draftPlan.titleKey}
                     onChange={(e) => setDraftPlan((prev) => ({ ...prev, titleKey: e.target.value }))}
                     className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                  />
               </div>

               <div>
                  <label className="block text-sm font-medium text-gray-700">
                     {t("plans.custom_plan_description")}
                  </label>
                  <textarea
                     value={draftPlan.descriptionKey}
                     onChange={(e) => setDraftPlan((prev) => ({ ...prev, descriptionKey: e.target.value }))}
                     rows={2}
                     className="mt-1 w-full rounded-xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                  />
               </div>

               <div className="space-y-4 pt-2">
                  {draftPlan.days.map((day, dayIndex) => (
                     <div key={day.dayId} className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                           <div className="flex-1">
                              <label className="block text-xs font-medium text-gray-600">
                                 {t("plans.day_name")}
                              </label>
                              <input
                                 type="text"
                                 value={day.dayNameKey}
                                 onChange={(e) =>
                                    setDraftPlan((prev) => ({
                                       ...prev,
                                       days: prev.days.map((d, idx) =>
                                          idx === dayIndex ? { ...d, dayNameKey: e.target.value } : d
                                       ),
                                    }))
                                 }
                                 className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm outline-none focus:border-brand-green"
                              />
                           </div>
                           <button
                              type="button"
                              onClick={() => handleRemoveDay(day.dayId)}
                              className="self-end rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 sm:self-center"
                           >
                              {t("plans.remove_day")}
                           </button>
                        </div>

                        {/* Вправи для конкретного дня */}
                        <div className="mt-4 space-y-3">
                           {day.exercises.map((exercise, exerciseIndex) => (
                              <div key={`${day.dayId}-ex-${exerciseIndex}`} className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm">
                                 <div className="grid gap-3 sm:grid-cols-4">
                                    <div className="sm:col-span-2">
                                       <label className="block text-xs text-gray-500">{t("plans.exercise")}</label>
                                       <select
                                          value={exercise.exerciseIndex}
                                          onChange={(e) =>
                                             handleUpdateExercise(
                                                day.dayId,
                                                exerciseIndex,
                                                "exerciseIndex",
                                                Number(e.target.value)
                                             )
                                          }
                                          className="mt-1 w-full rounded-lg border border-gray-300 bg-white p-2 text-sm"
                                       >
                                          {exerciseNames.map((label, optionIndex) => (
                                             <option key={optionIndex} value={optionIndex}>
                                                {label}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div>
                                       <label className="block text-xs text-gray-500">{t("plans.sets")}</label>
                                       <input
                                          type="number"
                                          min={1}
                                          value={exercise.sets}
                                          onChange={(e) =>
                                             handleUpdateExercise(day.dayId, exerciseIndex, "sets", Number(e.target.value))
                                          }
                                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-xs text-gray-500">{t("plans.reps")}</label>
                                       <input
                                          type="text"
                                          value={exercise.reps}
                                          onChange={(e) =>
                                             handleUpdateExercise(day.dayId, exerciseIndex, "reps", e.target.value)
                                          }
                                          className="mt-1 w-full rounded-lg border border-gray-300 p-2 text-sm"
                                       />
                                    </div>
                                 </div>

                                 <div className="mt-2 flex items-center justify-end">
                                    <button
                                       type="button"
                                       onClick={() => handleRemoveExercise(day.dayId, exerciseIndex)}
                                       className="text-xs font-medium text-red-500 hover:underline"
                                    >
                                       {t("plans.remove_exercise")}
                                    </button>
                                 </div>
                              </div>
                           ))}

                           <button
                              type="button"
                              onClick={() => handleAddExercise(day.dayId)}
                              className="mt-2 text-xs font-semibold text-brand-green hover:underline"
                           >
                              + {t("plans.add_exercise")}
                           </button>
                        </div>
                     </div>
                  ))}
               </div>

               {/* Кнопки управління внизу форми */}
               <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                     type="button"
                     onClick={handleAddDay}
                     className="rounded-lg border border-brand-green bg-white px-4 py-2 text-sm font-semibold text-brand-green transition hover:bg-brand-green/10"
                  >
                     {t("plans.add_day")}
                  </button>
                  <button
                     type="button"
                     onClick={handleSaveDraft}
                     className="rounded-lg bg-brand-green px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                  >
                     {isEditing ? t("plans.update_custom_plan") : t("plans.save_custom_plan")}
                  </button>
               </div>
            </div>
         </section>
      </div>
   );
};