import React from "react";
import { IWorkoutPlan } from "../Types/plan";
import { useLanguage } from "../Context/LanguageContext";

interface IActivePlanWidgetProps {
   activePlan?: IWorkoutPlan | null;
   activeDayIndex: number;
   onOpenPlanCatalog: () => void;
   onSelectDay: (dayIndex: number) => void;
   onStartWorkout: () => void;
}

export const ActivePlanWidget: React.FC<IActivePlanWidgetProps> = ({
   activePlan,
   activeDayIndex,
   onOpenPlanCatalog,
   onSelectDay,
   onStartWorkout,
}) => {
   const { t } = useLanguage();

   if (!activePlan) {
      return (
         <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 mb-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
               <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                     {t("plans.widget_heading")}
                  </p>
                  <h2 className="mt-2 text-xl font-semibold text-brand-text">
                     {t("plans.no_active_plan_title")}
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-gray-600 max-w-xl">
                     {t("plans.no_active_plan_description")}
                  </p>
               </div>
               <button
                  type="button"
                  onClick={onOpenPlanCatalog}
                  className="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark"
               >
                  {t("plans.select_workout_plan")}
               </button>
            </div>
         </section>
      );
   }

   const selectedDay = activePlan.days[activeDayIndex] ?? activePlan.days[0];
   const exerciseCount = selectedDay?.exercises.length ?? 0;

   return (
      <section className="bg-white rounded-3xl border border-gray-200 shadow-sm p-5 mb-6">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
               <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-green">
                  {t("plans.active_plan_label")}
               </p>
               <h2 className="mt-2 text-xl font-semibold text-brand-text">
                  {t(activePlan.titleKey)}
               </h2>
               <p className="mt-2 text-sm leading-6 text-gray-600 max-w-xl">
                  {t(activePlan.descriptionKey)}
               </p>
            </div>
            <div className="rounded-2xl bg-brand-green/10 px-4 py-3 text-sm font-medium text-brand-green">
               {activePlan.days.length} {t("plans.days")}
            </div>
         </div>

         <div className="mt-5 flex flex-wrap gap-2">
            {activePlan.days.map((day, index) => (
               <button
                  key={day.dayId}
                  type="button"
                  onClick={() => onSelectDay(index)}
                  className={`rounded-full border px-4 py-2 text-sm font-medium transition ${index === activeDayIndex
                     ? "border-brand-green bg-brand-green text-white"
                     : "border-gray-200 bg-white text-gray-700 hover:border-brand-green hover:text-brand-green"
                     }`}
               >
                  {t(day.dayNameKey)}
               </button>
            ))}
         </div>

         <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
               <p className="text-sm text-gray-500">
                  {t("plans.day_summary", {
                     count: exerciseCount,
                     day: t(selectedDay.dayNameKey),
                  })}
               </p>
               <p className="mt-2 text-sm leading-6 text-gray-600">
                  {t("plans.plan_instruction")}
               </p>
            </div>
            <button
               type="button"
               onClick={onStartWorkout}
               className="inline-flex items-center justify-center rounded-full bg-brand-green px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-brand-green-dark"
            >
               {t("plans.start_todays_workout")}
            </button>
         </div>
      </section>
   );
};
