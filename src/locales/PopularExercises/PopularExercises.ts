import { de_POPULAR_EXERCISES } from "./de";
import { en_POPULAR_EXERCISES } from "./en";
import { ru_POPULAR_EXERCISES } from "./ru";
import { uk_POPULAR_EXERCISES } from "./uk";

export const POPULAR_EXERCISES = {
   en: en_POPULAR_EXERCISES,
   uk: uk_POPULAR_EXERCISES,
   de: de_POPULAR_EXERCISES,
   ru: ru_POPULAR_EXERCISES,
};

export const ALL_POPULAR_EXERCISES = [
   ...en_POPULAR_EXERCISES,
   ...uk_POPULAR_EXERCISES,
   ...de_POPULAR_EXERCISES,
   ...ru_POPULAR_EXERCISES,
];
