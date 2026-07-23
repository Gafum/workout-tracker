import React from "react";
import { IWorkoutPlan } from "../../Types/plan";
import { useLanguage } from "../../Context/LanguageContext";

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
         <section className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5 flex flex-col items-center">
            <p className="text-lg text-brand-green-dark text-left">
               {t("plans.widget_heading")}
            </p>
            <h2 className="text-lg font-semibold text-brand-text">
               {t("plans.no_active_plan_title")}
            </h2>
            <button
               type="button"
               onClick={onOpenPlanCatalog}
               className="inline-flex items-center justify-center rounded-lg border border-brand-green bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark mt-3 w-60 max-w-[100%]"
            >
               {t("plans.select_workout_plan")}
            </button>
         </section>
      );
   }

   const selectedDay = activePlan.days[activeDayIndex] ?? activePlan.days[0];
   const exerciseCount = selectedDay?.exercises.length ?? 0;

   return (
      <section className="mb-5 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
         <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
               <p className="text-lg text-brand-green-dark text-left">
                  {t("plans.active_plan_label")}
               </p>
               <h2 className="mt-1 text-lg font-semibold text-brand-text">
                  {t(activePlan.titleKey)}
               </h2>
            </div>
            <div className="rounded-lg bg-brand-green/10 px-3 py-2 text-sm w-max font-medium text-brand-green">
               {activePlan.days.length} {t("plans.days")}
            </div>
         </div>

         <div className="mt-4 flex flex-wrap gap-2">
            {activePlan.days.map((day, index) => (
               <button
                  key={day.dayId}
                  type="button"
                  onClick={() => onSelectDay(index)}
                  className={`rounded-lg border px-3 py-2 text-sm font-medium transition ${index === activeDayIndex
                     ? "border-brand-green bg-brand-green text-white"
                     : "border-gray-200 bg-white text-gray-700 hover:border-brand-green hover:text-brand-green"
                     }`}
               >
                  {t(day.dayNameKey)}
               </button>
            ))}
         </div>

         <div className="mt-2 flex flex-col items-left gap-1">
            <p className="text-sm text-gray-500">
               {t("plans.day_summary", {
                  count: exerciseCount,
                  day: t(selectedDay.dayNameKey),
               })}
            </p>
            <button
               type="button"
               onClick={onStartWorkout}
               className="inline-flex items-center justify-center rounded-lg border border-brand-green bg-brand-green px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-green-dark mt-3 w-80 max-w-[100%]"
            >
               {t("plans.start_todays_workout")}
            </button>
         </div>
      </section>
   );
};
