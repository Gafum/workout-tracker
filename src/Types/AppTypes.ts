import { JSX } from "react";

export type TypeAppMode = 'exercise' | 'weight'; // Or 'weightfood' if you prefer

// Add new unit types and preferences interface
export type WeightUnit = 'kg' | 'lbs';
export type HeightUnit = 'cm' | 'ft'; // 'ft' could represent ft/in combined display later

export interface IUnitPreferences {
  weight: WeightUnit;
  height: HeightUnit;
}

export interface IScreen {
    path: string;
    component: JSX.Element;
}

export interface IScreenList {
    [key: string]: IScreen;
}

// New type for a single exercise entry
export interface IExerciseSet {
    notes: any;
    id: string;
    reps: string | number;
    weight?: string | number;
}

export interface IExerciseEntry {
    details: any;
    id: string;
    name: string;
    sets: IExerciseSet[];
}

// New type for daily exercise data
export interface IDailyExercises {
    date: string; // Store date as ISO string (YYYY-MM-DD) for easy keying
    entries: IExerciseEntry[];
}

// New type for daily weight data
export interface IDailyWeight {
    date: string; // Store date as ISO string (YYYY-MM-DD)
    morningWeight?: number | null; // Optional weight in kg/lbs
    eveningWeight?: number | null; // Optional weight in kg/lbs
    height?: number | null; // Add height
    age?: number | null; // Add age for BMR
    // Add food entries later if needed
}

// --- New Food Entry Type ---
export interface IFoodEntry {
    id: string; // Unique ID
    name: string;
    calories: number;
    // Optional: Add protein, carbs, fat if needed later
}
// --- End New Food Entry Type ---

// --- Modified Daily Data Type ---
// Combines weight and food for a single day
export interface IDailyWeightFood {
    date: string; // YYYY-MM-DD format
    morningWeight: number | null;
    eveningWeight: number | null;
    height: number | null; // Added height
    age: number | null; // Added age for BMR calculation
    foodEntries: IFoodEntry[]; // Array to hold multiple food items
}
// --- End Modified Daily Data Type ---

export type BmiCategory = 'Underweight' | 'Normal' | 'Overweight' | 'Obese' | 'N/A';

// Calendar Tile Properties (if not already defined elsewhere)
export interface CalendarTileProperties {
    date: Date;
    view: string;
}