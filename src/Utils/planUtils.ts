import { getItemFromLocalStorage, setItemInLocalStorage } from "./localStorageCore";
import { PRESET_WORKOUT_PLANS } from "../constants/presetPlans";
import { IWorkoutPlan } from "../Types/plan";

const WORKOUT_PLANS_KEY = "sport-counter-workout-plans";
const ACTIVE_PLAN_ID_KEY = "sport-counter-active-plan-id";
const ACTIVE_PLAN_DAY_INDEX_KEY = "sport-counter-active-plan-day-index";

export const loadSavedCustomPlans = (): IWorkoutPlan[] =>
   getItemFromLocalStorage<IWorkoutPlan[]>(WORKOUT_PLANS_KEY, []);

export const saveCustomPlans = (plans: IWorkoutPlan[]): boolean =>
   setItemInLocalStorage<IWorkoutPlan[]>(WORKOUT_PLANS_KEY, plans);

export const loadActivePlanId = (): string | null =>
   getItemFromLocalStorage<string | null>(ACTIVE_PLAN_ID_KEY, null);

export const saveActivePlanId = (planId: string | null): boolean =>
   setItemInLocalStorage<string | null>(ACTIVE_PLAN_ID_KEY, planId);

export const loadActivePlanDayIndex = (): number =>
   getItemFromLocalStorage<number>(ACTIVE_PLAN_DAY_INDEX_KEY, 0);

export const saveActivePlanDayIndex = (dayIndex: number): boolean =>
   setItemInLocalStorage<number>(ACTIVE_PLAN_DAY_INDEX_KEY, dayIndex);

export const getAllWorkoutPlans = (): IWorkoutPlan[] => [
   ...PRESET_WORKOUT_PLANS,
   ...loadSavedCustomPlans(),
];

export const getWorkoutPlanById = (id: string): IWorkoutPlan | undefined =>
   getAllWorkoutPlans().find((plan) => plan.id === id);
