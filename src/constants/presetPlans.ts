import { IWorkoutPlan } from "../Types/plan";

export const PRESET_WORKOUT_PLANS: IWorkoutPlan[] = [
   {
      id: "fullbody-2day",
      titleKey: "plans.fullbody_2day.title",
      descriptionKey: "plans.fullbody_2day.description",
      categoryKey: "plans.category.fullbody",
      days: [
         {
            dayId: "fullbody-2day-day1",
            dayNameKey: "plans.fullbody_2day.day1",
            exercises: [
               { exerciseIndex: 30, sets: 4, reps: "8-10", defaultWeight: 40, proTipKey: "plans.proTip.gobletSquat" },
               { exerciseIndex: 0, sets: 4, reps: "6-8", defaultWeight: 70, proTipKey: "plans.proTip.benchPress" },
               { exerciseIndex: 34, sets: 4, reps: "8-10", defaultWeight: 60, proTipKey: "plans.proTip.latPulldown" },
               { exerciseIndex: 12, sets: 3, reps: "12-15", defaultWeight: 10, proTipKey: "plans.proTip.lateralRaise" },
               { exerciseIndex: 10, sets: 3, reps: "10-12", defaultWeight: 14, proTipKey: "plans.proTip.bicepCurl" },
               { exerciseIndex: 76, sets: 3, reps: "12-15", defaultWeight: 0, proTipKey: "plans.proTip.hyperextension" },
               { exerciseIndex: 19, sets: 3, reps: "15-20", defaultWeight: 0, proTipKey: "plans.proTip.crunch" },
            ],
         },
         {
            dayId: "fullbody-2day-day2",
            dayNameKey: "plans.fullbody_2day.day2",
            exercises: [
               { exerciseIndex: 5, sets: 4, reps: "6-8", defaultWeight: 0, proTipKey: "plans.proTip.pullUp" },
               { exerciseIndex: 14, sets: 4, reps: "10-12", defaultWeight: 120, proTipKey: "plans.proTip.legPress" },
               { exerciseIndex: 28, sets: 4, reps: "8-10", defaultWeight: 20, proTipKey: "plans.proTip.dumbbellShoulderPress" },
               { exerciseIndex: 33, sets: 4, reps: "8-10", defaultWeight: 55, proTipKey: "plans.proTip.seatedCableRow" },
               { exerciseIndex: 8, sets: 3, reps: "8-10", defaultWeight: 0, proTipKey: "plans.proTip.dip" },
               { exerciseIndex: 89, sets: 3, reps: "12-15", defaultWeight: 0, proTipKey: "plans.proTip.standingCalfRaise" },
               { exerciseIndex: 18, sets: 3, reps: "45 sec", defaultWeight: 0, proTipKey: "plans.proTip.plank" },
            ],
         },
      ],
   },
   {
      id: "ppl-3day",
      titleKey: "plans.ppl_3day.title",
      descriptionKey: "plans.ppl_3day.description",
      categoryKey: "plans.category.ppl",
      days: [
         {
            dayId: "ppl-3day-day1",
            dayNameKey: "plans.ppl_3day.day1",
            exercises: [
               { exerciseIndex: 0, sets: 4, reps: "5-8", defaultWeight: 80, proTipKey: "plans.proTip.benchPress" },
               { exerciseIndex: 3, sets: 4, reps: "6-8", defaultWeight: 50, proTipKey: "plans.proTip.overheadPress" },
               { exerciseIndex: 25, sets: 4, reps: "8-10", defaultWeight: 22, proTipKey: "plans.proTip.inclineDumbbellPress" },
               { exerciseIndex: 37, sets: 3, reps: "10-12", defaultWeight: 35, proTipKey: "plans.proTip.tricepsPushdown" },
               { exerciseIndex: 82, sets: 3, reps: "12-15", defaultWeight: 8, proTipKey: "plans.proTip.cableLateralRaise" },
            ],
         },
         {
            dayId: "ppl-3day-day2",
            dayNameKey: "plans.ppl_3day.day2",
            exercises: [
               { exerciseIndex: 4, sets: 4, reps: "6-8", defaultWeight: 70, proTipKey: "plans.proTip.barbellRow" },
               { exerciseIndex: 34, sets: 4, reps: "8-10", defaultWeight: 60, proTipKey: "plans.proTip.latPulldown" },
               { exerciseIndex: 26, sets: 4, reps: "8-10", defaultWeight: 25, proTipKey: "plans.proTip.dumbbellRow" },
               { exerciseIndex: 22, sets: 3, reps: "12-15", defaultWeight: 20, proTipKey: "plans.proTip.facePull" },
               { exerciseIndex: 84, sets: 3, reps: "10-12", defaultWeight: 25, proTipKey: "plans.proTip.barbellCurl" },
            ],
         },
         {
            dayId: "ppl-3day-day3",
            dayNameKey: "plans.ppl_3day.day3",
            exercises: [
               { exerciseIndex: 1, sets: 4, reps: "5-8", defaultWeight: 100, proTipKey: "plans.proTip.squat" },
               { exerciseIndex: 31, sets: 4, reps: "6-8", defaultWeight: 80, proTipKey: "plans.proTip.romanianDeadlift" },
               { exerciseIndex: 16, sets: 3, reps: "10-12", defaultWeight: 45, proTipKey: "plans.proTip.legExtension" },
               { exerciseIndex: 15, sets: 3, reps: "10-12", defaultWeight: 45, proTipKey: "plans.proTip.legCurl" },
               { exerciseIndex: 89, sets: 3, reps: "12-15", defaultWeight: 0, proTipKey: "plans.proTip.standingCalfRaise" },
               { exerciseIndex: 21, sets: 3, reps: "12-15", defaultWeight: 0, proTipKey: "plans.proTip.hangingLegRaise" },
            ],
         },
      ],
   },
];
