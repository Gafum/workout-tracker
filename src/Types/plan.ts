export interface IPlanExercise {
   exerciseIndex: number; // Reference to POPULAR_EXERCISES[index]
   sets: number;
   reps: string;
   defaultWeight?: number;
   proTipKey?: string; // i18n key for tips
}

export interface IWorkoutDay {
   dayId: string;
   dayNameKey: string; // e.g., "plans.fullbody_2day.day1"
   exercises: IPlanExercise[];
}

export interface IWorkoutPlan {
   id: string;
   titleKey: string;
   descriptionKey: string;
   categoryKey?: string;
   isCustom?: boolean;
   days: IWorkoutDay[];
}
