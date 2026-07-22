import React from "react";
import { WorkoutPlanCatalog } from "../../Components/WorkoutPlanCatalog";
import { useAppContext } from "../../Context/AppContext";
import { useLanguage } from "../../Context/LanguageContext";

export const Plans: React.FC = () => {
   const {
      activePlanId,
      customPlans,
      setActivePlanId,
      saveCustomPlans,
   } = useAppContext();
   const { t } = useLanguage();

   const handleSetActivePlan = (planId: string) => {
      setActivePlanId(planId);
   };

   return (
      <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
         <div className="mb-6">
            <h2 className="text-2xl font-semibold text-brand-green-dark">
               {t("plans.catalog_title")}
            </h2>
            <p className="mt-2 text-sm leading-6 text-gray-600">
               {t("plans.catalog_description")}
            </p>
         </div>
         <WorkoutPlanCatalog
            activePlanId={activePlanId}
            customPlans={customPlans}
            onSetActivePlan={handleSetActivePlan}
            onSaveCustomPlans={saveCustomPlans}
         />
      </div>
   );
};
