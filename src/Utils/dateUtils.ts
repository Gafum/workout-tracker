import { format } from "date-fns";

// --- Date Key Helper ---
export const getDateKey = (date: Date): string => {
   return format(date, "yyyy-MM-dd");
};