import React, { useMemo, useState } from "react";
import { useLanguage } from "../Context/LanguageContext";
import { POPULAR_EXERCISES } from "../locales/PopularExercises/PopularExercises";
import { IWorkoutPlan, IWorkoutDay, IPlanExercise } from "../Types/plan";
import { PRESET_WORKOUT_PLANS } from "../constants/presetPlans";

interface IWorkoutPlanCatalogProps {
   activePlanId?: string | null;
   customPlans: IWorkoutPlan[];
   onSetActivePlan: (planId: string) => void;
   onSaveCustomPlans: (plans: IWorkoutPlan[]) => void;
}

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

export const WorkoutPlanCatalog: React.FC<IWorkoutPlanCatalogProps> = ({
   activePlanId,
   customPlans,
   onSetActivePlan,
   onSaveCustomPlans,
}) => {
   const { t, language } = useLanguage();
   const exerciseNames = POPULAR_EXERCISES[language as keyof typeof POPULAR_EXERCISES] ||
      POPULAR_EXERCISES.en;
   const allPlans = useMemo(
      () => [...PRESET_WORKOUT_PLANS, ...customPlans],
      [customPlans]
   );

   const [expandedPlanId, setExpandedPlanId] = useState<string | null>(
      activePlanId || allPlans[0]?.id || null
   );
   const [draftPlan, setDraftPlan] = useState<IWorkoutPlan>(createEmptyPlan());
   const [isEditing, setIsEditing] = useState(false);

   const selectedPlan = useMemo(
      () => allPlans.find((plan) => plan.id === expandedPlanId) || null,
      [allPlans, expandedPlanId]
   );

   const customPlanOptions = useMemo(
      () => customPlans.map((plan) => ({ id: plan.id, title: formatPlanTitle(plan, t) })),
      [customPlans, t]
   );

   const handlePlanSelect = (planId: string) => {
      setExpandedPlanId(planId);
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
                  exercises: day.exercises.filter((_, exerciseIndex) => exerciseIndex !== index),
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
      setExpandedPlanId(nextPlan.id);
   };

   const handleEditCustomPlan = (planId: string) => {
      const planToEdit = customPlans.find((plan) => plan.id === planId);
      if (!planToEdit) {
         return;
      }
      setDraftPlan(planToEdit);
      setIsEditing(true);
      setExpandedPlanId(planId);
   };

   const handleDeleteCustomPlan = (planId: string) => {
      const filteredPlans = customPlans.filter((plan) => plan.id !== planId);
      onSaveCustomPlans(filteredPlans);
      if (expandedPlanId === planId) {
         setExpandedPlanId(filteredPlans[0]?.id || PRESET_WORKOUT_PLANS[0]?.id || null);
      }
   };

   return (
      <div className="space-y-6 py-4">
         <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                     {t("plans.catalog_title")}
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-brand-text">
                     {t("plans.catalog_subtitle")}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-600">
                     {t("plans.catalog_description")}
                  </p>
               </div>
               <button
                  type="button"
                  onClick={() => {
                     setDraftPlan(createEmptyPlan());
                     setIsEditing(true);
                  }}
                  className="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
               >
                  {t("plans.create_custom_plan")}
               </button>
            </div>
         </div>

         <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-4">
               {allPlans.map((plan) => {
                  const isActive = plan.id === activePlanId;
                  return (
                     <article key={plan.id} className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                           <div>
                              <h2 className="text-lg font-semibold text-brand-text">
                                 {formatPlanTitle(plan, t)}
                              </h2>
                              <p className="mt-1 text-sm text-gray-500">
                                 {plan.categoryKey ? t(plan.categoryKey) : t("plans.category.custom")}
                              </p>
                           </div>
                           <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                                 {plan.days.length} {t("plans.days")}
                              </span>
                              <button
                                 type="button"
                                 onClick={() => handlePlanSelect(plan.id)}
                                 className="rounded-full border border-brand-green bg-white px-4 py-2 text-sm font-semibold text-brand-green transition hover:bg-brand-green hover:text-white"
                              >
                                 {t("plans.view_details")}
                              </button>
                           </div>
                        </div>
                        <div className="mt-4 flex flex-wrap gap-2">
                           <button
                              type="button"
                              onClick={() => onSetActivePlan(plan.id)}
                              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${isActive
                                    ? "bg-brand-green text-white"
                                    : "bg-gray-100 text-gray-800 hover:bg-brand-green hover:text-white"
                                 }`}
                           >
                              {isActive ? t("plans.active_label") : t("plans.set_active_plan")}
                           </button>
                           {plan.isCustom && (
                              <>
                                 <button
                                    type="button"
                                    onClick={() => handleEditCustomPlan(plan.id)}
                                    className="rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:border-brand-green hover:text-brand-green"
                                 >
                                    {t("plans.edit_custom_plan")}
                                 </button>
                                 <button
                                    type="button"
                                    onClick={() => handleDeleteCustomPlan(plan.id)}
                                    className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                                 >
                                    {t("plans.delete_custom_plan")}
                                 </button>
                              </>
                           )}
                        </div>
                     </article>
                  );
               })}
            </div>

            <aside className="space-y-4">
               {selectedPlan ? (
                  <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                     <div className="flex items-start justify-between gap-4">
                        <div>
                           <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                              {t("plans.plan_preview")}
                           </p>
                           <h2 className="mt-2 text-xl font-semibold text-brand-text">
                              {formatPlanTitle(selectedPlan, t)}
                           </h2>
                        </div>
                        <span className="rounded-full bg-brand-green/10 px-3 py-1 text-xs font-semibold text-brand-green">
                           {selectedPlan.days.length} {t("plans.days")}
                        </span>
                     </div>
                     <div className="mt-4 divide-y divide-gray-200">
                        {selectedPlan.days.map((day) => (
                           <div key={day.dayId} className="py-4">
                              <h3 className="text-sm font-semibold text-brand-text">
                                 {t(day.dayNameKey)}
                              </h3>
                              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                                 {day.exercises.map((exercise, index) => (
                                    <li key={`${day.dayId}-${index}`} className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                                       <div className="flex items-center justify-between gap-3">
                                          <span className="font-medium text-brand-text">
                                             {exerciseNames[exercise.exerciseIndex] || `Exercise ${exercise.exerciseIndex}`}
                                          </span>
                                          <span className="text-xs text-gray-500">
                                             {exercise.sets}x {exercise.reps}
                                          </span>
                                       </div>
                                       <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                                          {exercise.defaultWeight !== undefined && (
                                             <span>{t("plans.standard_weight")}: {exercise.defaultWeight}</span>
                                          )}
                                          {exercise.proTipKey && (
                                             <span>{t(exercise.proTipKey)}</span>
                                          )}
                                       </div>
                                    </li>
                                 ))}
                                 {day.exercises.length === 0 && (
                                    <li className="text-xs text-gray-500">{t("plans.no_exercises_in_day")}</li>
                                 )}
                              </ul>
                           </div>
                        ))}
                     </div>
                  </section>
               ) : (
                  <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                     <p className="text-sm text-gray-500">{t("plans.select_plan_to_preview")}</p>
                  </div>
               )}

               <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
                  <h2 className="text-lg font-semibold text-brand-text">
                     {t("plans.custom_plan_builder")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600">
                     {t("plans.custom_plan_builder_description")}
                  </p>
                  <div className="mt-4 space-y-3">
                     <label className="block text-sm font-medium text-gray-700">
                        {t("plans.custom_plan_title")}
                     </label>
                     <input
                        type="text"
                        value={draftPlan.titleKey}
                        onChange={(event) =>
                           setDraftPlan((previous) => ({ ...previous, titleKey: event.target.value }))
                        }
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                     />
                     <label className="block text-sm font-medium text-gray-700">
                        {t("plans.custom_plan_description")}
                     </label>
                     <textarea
                        value={draftPlan.descriptionKey}
                        onChange={(event) =>
                           setDraftPlan((previous) => ({ ...previous, descriptionKey: event.target.value }))
                        }
                        rows={3}
                        className="w-full rounded-2xl border border-gray-300 bg-gray-50 px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                     />
                     <div className="flex flex-wrap gap-2">
                        <button
                           type="button"
                           onClick={handleAddDay}
                           className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                        >
                           {t("plans.add_day")}
                        </button>
                        <button
                           type="button"
                           onClick={handleSaveDraft}
                           className="rounded-full bg-brand-green/90 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                        >
                           {isEditing ? t("plans.update_custom_plan") : t("plans.save_custom_plan")}
                        </button>
                     </div>
                  </div>
               </section>
            </aside>
         </div>

         {isEditing && (
            <section className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm">
               <h2 className="text-lg font-semibold text-brand-text">
                  {t("plans.editing_custom_plan")}
               </h2>
               <div className="mt-4 space-y-5">
                  {draftPlan.days.map((day, dayIndex) => (
                     <div key={day.dayId} className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                           <div>
                              <label className="block text-sm font-medium text-gray-700">
                                 {t("plans.day_name")}
                              </label>
                              <input
                                 type="text"
                                 value={day.dayNameKey}
                                 onChange={(event) =>
                                    setDraftPlan((previous) => ({
                                       ...previous,
                                       days: previous.days.map((currentDay, index) =>
                                          index === dayIndex
                                             ? { ...currentDay, dayNameKey: event.target.value }
                                             : currentDay
                                       ),
                                    }))
                                 }
                                 className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                              />
                           </div>
                           <button
                              type="button"
                              onClick={() => handleRemoveDay(day.dayId)}
                              className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                           >
                              {t("plans.remove_day")}
                           </button>
                        </div>

                        <div className="mt-4 space-y-4">
                           {day.exercises.map((exercise, exerciseIndex) => (
                              <div key={`${day.dayId}-exercise-${exerciseIndex}`} className="rounded-2xl border border-gray-200 bg-white p-4">
                                 <div className="grid gap-3 sm:grid-cols-2">
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700">
                                          {t("plans.exercise")}
                                       </label>
                                       <select
                                          value={exercise.exerciseIndex}
                                          onChange={(event) =>
                                             handleUpdateExercise(
                                                day.dayId,
                                                exerciseIndex,
                                                "exerciseIndex",
                                                Number(event.target.value)
                                             )
                                          }
                                          className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                                       >
                                          {exerciseNames.map((label, optionIndex) => (
                                             <option key={optionIndex} value={optionIndex}>
                                                {label}
                                             </option>
                                          ))}
                                       </select>
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700">
                                          {t("plans.sets")}
                                       </label>
                                       <input
                                          type="number"
                                          min={1}
                                          value={exercise.sets}
                                          onChange={(event) =>
                                             handleUpdateExercise(
                                                day.dayId,
                                                exerciseIndex,
                                                "sets",
                                                Number(event.target.value)
                                             )
                                          }
                                          className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700">
                                          {t("plans.reps")}
                                       </label>
                                       <input
                                          type="text"
                                          value={exercise.reps}
                                          onChange={(event) =>
                                             handleUpdateExercise(
                                                day.dayId,
                                                exerciseIndex,
                                                "reps",
                                                event.target.value
                                             )
                                          }
                                          className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                                       />
                                    </div>
                                    <div>
                                       <label className="block text-sm font-medium text-gray-700">
                                          {t("plans.default_weight")}
                                       </label>
                                       <input
                                          type="number"
                                          min={0}
                                          value={exercise.defaultWeight ?? ""}
                                          onChange={(event) =>
                                             handleUpdateExercise(
                                                day.dayId,
                                                exerciseIndex,
                                                "defaultWeight",
                                                event.target.value === "" ? undefined : Number(event.target.value)
                                             )
                                          }
                                          className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                                       />
                                    </div>
                                    <div className="sm:col-span-2">
                                       <label className="block text-sm font-medium text-gray-700">
                                          {t("plans.pro_tip")}
                                       </label>
                                       <input
                                          type="text"
                                          value={exercise.proTipKey ?? ""}
                                          onChange={(event) =>
                                             handleUpdateExercise(
                                                day.dayId,
                                                exerciseIndex,
                                                "proTipKey",
                                                event.target.value
                                             )
                                          }
                                          className="w-full rounded-2xl border border-gray-300 bg-white px-3 py-2 text-sm outline-none transition focus:border-brand-green focus:ring-1 focus:ring-brand-green/20"
                                       />
                                    </div>
                                 </div>
                                 <div className="mt-3 text-right">
                                    <button
                                       type="button"
                                       onClick={() => handleRemoveExercise(day.dayId, exerciseIndex)}
                                       className="rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                                    >
                                       {t("plans.remove_exercise")}
                                    </button>
                                 </div>
                              </div>
                           ))}
                           <button
                              type="button"
                              onClick={() => handleAddExercise(day.dayId)}
                              className="rounded-full bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark"
                           >
                              {t("plans.add_exercise")}
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            </section>
         )}
      </div>
   );
};
