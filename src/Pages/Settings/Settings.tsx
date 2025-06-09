import React, { useState, useEffect } from "react";
import {
   getAllExerciseNames,
   getExercisesForDateRangeFormatted,
   saveUnitPreferences,
   loadUnitPreferences,
} from "../../Utils/LocalStorageUtils";
import { EditExerciseModal } from "../../Components/SettingsPage/EditExerciseModal";
import { DeleteExerciseModal } from "../../Components/SettingsPage/DeleteExerciseModal";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
   IUnitPreferences,
   WeightUnit,
   HeightUnit,
   CalendarWeekStart,
} from "../../Types/AppTypes";
import { useLanguage } from "../../Context/LanguageContext";

export const Settings: React.FC = () => {
   const [exerciseNames, setExerciseNames] = useState<string[]>([]);
   const [showEditModal, setShowEditModal] = useState(false);
   const [showDeleteModal, setShowDeleteModal] = useState(false);
   const [selectedExercise, setSelectedExercise] = useState("");
   const [newExerciseName, setNewExerciseName] = useState("");
   const [copyStatus, setCopyStatus] = useState<string | null>(null);
   const [startDate, setStartDate] = useState<Date | null>(null);
   const [endDate, setEndDate] = useState<Date | null>(null);
   const [unitPreferences, setUnitPreferences] = useState<IUnitPreferences>(
      loadUnitPreferences()
   );
   const { language: currentLanguage, setLanguage, t } = useLanguage();

   useEffect(() => {
      loadExerciseNames();
      setUnitPreferences(loadUnitPreferences());
   }, []);

   const loadExerciseNames = () => {
      const names = getAllExerciseNames();
      setExerciseNames(names);
   };

   const handleEditClick = (exercise: string) => {
      setSelectedExercise(exercise);
      setNewExerciseName(exercise);
      setShowEditModal(true);
   };

   const handleDeleteClick = (exercise: string) => {
      setSelectedExercise(exercise);
      setShowDeleteModal(true);
   };

   const handleSaveEdit = () => {
      setShowEditModal(false);
      loadExerciseNames();
   };

   const handleConfirmDelete = () => {
      setShowDeleteModal(false);
      loadExerciseNames();
   };

   const handleCopySelectedDates = async () => {
      if (!startDate || !endDate) {
         setCopyStatus(t("select_date_range")); // Using existing key
         setTimeout(() => setCopyStatus(null), 3000);
         return;
      }
      const formattedData = getExercisesForDateRangeFormatted(
         startDate,
         endDate
      );
      try {
         await navigator.clipboard.writeText(
            Array.isArray(formattedData)
               ? formattedData.join("\n")
               : formattedData
         );
         setCopyStatus(t("copy_success")); // Using new key
      } catch (err) {
         console.error("Failed to copy:", err);
         setCopyStatus(t("copy_error")); // Using new key
      }
      setTimeout(() => setCopyStatus(null), 3000);
   };

   const handleUnitChange = (
      type: keyof IUnitPreferences,
      value: WeightUnit | HeightUnit | CalendarWeekStart
   ) => {
      const newPreferences = { ...unitPreferences, [type]: value };
      setUnitPreferences(newPreferences);
      saveUnitPreferences(newPreferences);
   };

   const getWeekStartsOn = () => {
      return unitPreferences.calendarWeekStart === "monday" ? 1 : 0;
   };

   return (
      <div className="p-4 sm:p-6 bg-white rounded-xl shadow-md border border-gray-200">
         <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-brand-green-dark mb-5 sm:mb-6">
            {t("settings")}
         </h2>

         <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               {t("units")} {/* Using existing key */}
            </h3>
            <div className="space-y-4">
               {/* Weight Unit Selector */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     {t("weight_unit")}
                  </label>
                  <div className="flex space-x-2">
                     {(["kg", "lbs"] as WeightUnit[]).map((unit) => (
                        <button
                           key={unit}
                           onClick={() => handleUnitChange("weight", unit)}
                           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                     ${
                                        unitPreferences.weight === unit
                                           ? "bg-brand-green text-white shadow-sm"
                                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                     }`}
                        >
                           {unit.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>

               {/* Height Unit Selector */}
               <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                     {t("height_unit")}
                  </label>
                  <div className="flex space-x-2">
                     {(["cm", "ft/in"] as HeightUnit[]).map((unit) => (
                        <button
                           key={unit}
                           onClick={() => handleUnitChange("height", unit)}
                           className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                                     ${
                                        unitPreferences.height === unit
                                           ? "bg-brand-green text-white shadow-sm"
                                           : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                     }`}
                        >
                           {unit.toUpperCase()}
                        </button>
                     ))}
                  </div>
               </div>
            </div>
         </div>

         {/* Calendar Week Start Section */}
         <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               {t("calendar_start")}
            </h3>
            <div className="flex space-x-2">
               {(["sunday", "monday"] as CalendarWeekStart[]).map((day) => (
                  <button
                     key={day}
                     onClick={() => handleUnitChange("calendarWeekStart", day)}
                     className={`px-4 py-2 rounded-md text-sm font-medium transition-colors
                               ${
                                  unitPreferences.calendarWeekStart === day
                                     ? "bg-brand-green text-white shadow-sm"
                                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                               }`}
                  >
                     {t(
                        day === "sunday" ? "calendar_sunday" : "calendar_monday"
                     )}{" "}
                     {/* Using new keys */}
                  </button>
               ))}
            </div>
         </div>

         <div className="mb-6 border-b border-gray-200 pb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               {t("data_export")}
            </h3>
            <div className="flex flex-col items-start sm:flex-row md:items-center space-y-3 sm:space-y-0 sm:space-x-4 mb-4">
               <div className="flex flex-col">
                  <label
                     htmlFor="startDate"
                     className="text-sm font-medium text-gray-700 mb-1"
                  >
                     {t("start_date")}
                  </label>
                  <DatePicker
                     id="startDate"
                     selected={startDate}
                     onChange={(date: Date | null) => setStartDate(date)}
                     selectsStart
                     startDate={startDate}
                     endDate={endDate}
                     className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto"
                     dateFormat="yyyy-MM-dd"
                     placeholderText={t("select_start_date")}
                     calendarStartDay={getWeekStartsOn()}
                  />
               </div>
               <div className="flex flex-col">
                  <label
                     htmlFor="endDate"
                     className="text-sm font-medium text-gray-700 mb-1"
                  >
                     {t("end_date")}
                  </label>
                  <DatePicker
                     id="endDate"
                     selected={endDate}
                     onChange={(date: Date | null) => setEndDate(date)}
                     selectsEnd
                     startDate={startDate}
                     endDate={endDate}
                     minDate={startDate || undefined}
                     className="border border-gray-300 rounded-md p-2 text-sm w-full sm:w-auto"
                     dateFormat="yyyy-MM-dd"
                     placeholderText={t("select_end_date")}
                     calendarStartDay={getWeekStartsOn()}
                  />
               </div>
            </div>
            <button
               onClick={handleCopySelectedDates}
               className="px-4 py-2 bg-brand-green text-white font-medium rounded-md shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition duration-150 ease-in-out text-sm"
            >
               {t("copy_selected_exercises")}
            </button>
            {copyStatus && (
               <p
                  className={`mt-2 text-sm ${
                     copyStatus.startsWith(t("copy_error"))
                        ? "text-red-600"
                        : "text-green-600"
                  }`}
               >
                  {copyStatus}
               </p>
            )}
         </div>

         <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">{t("language")}</h3>
            <select
               value={currentLanguage}
               onChange={(e) =>
                  setLanguage(e.target.value as "en" | "uk" | "de" | "ru")
               }
               className="w-full p-2 border rounded"
            >
               <option value="en">{t("english")}</option>
               <option value="uk">{t("ukrainian")}</option>
               <option value="de">{t("german")}</option>
               <option value="ru">{t("russian")}</option>
            </select>
         </div>

         <div className="mb-6">
            <h3 className="text-base sm:text-lg font-semibold text-brand-text mb-3">
               {t("saved_exercises")}
            </h3>
            {exerciseNames.length === 0 ? (
               <p className="text-center text-gray-500 italic mt-4">
                  {t("no_saved_exercises")}
               </p>
            ) : (
               <div className="space-y-2">
                  {exerciseNames.map((exercise) => (
                     <div
                        key={exercise}
                        className="p-3 sm:p-4 border border-gray-200 rounded-lg flex justify-between items-center max-w-[100%] overflow-hidden"
                     >
                        <span className="font-medium text-brand-text break-words text-wrap max-w-[100%] overflow-hidden">
                           {exercise}
                        </span>
                        <div className="flex space-x-2">
                           <button
                              onClick={() => handleEditClick(exercise)}
                              className="p-1.5 text-gray-600 hover:text-brand-green transition-colors"
                              aria-label={t("edit_exercise")}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                 />
                              </svg>
                           </button>
                           <button
                              onClick={() => handleDeleteClick(exercise)}
                              className="p-1.5 text-gray-600 hover:text-red-500 transition-colors"
                              aria-label={t("delete_exercise")}
                           >
                              <svg
                                 xmlns="http://www.w3.org/2000/svg"
                                 className="h-5 w-5"
                                 fill="none"
                                 viewBox="0 0 24 24"
                                 stroke="currentColor"
                              >
                                 <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                 />
                              </svg>
                           </button>
                        </div>
                     </div>
                  ))}
               </div>
            )}
         </div>

         {showEditModal && (
            <EditExerciseModal
               exercise={selectedExercise}
               newName={newExerciseName}
               setNewName={setNewExerciseName}
               onSave={handleSaveEdit}
               onCancel={() => setShowEditModal(false)}
               title={t('edit_exercise_modal_title')}
            />
         )}

         {showDeleteModal && (
            <DeleteExerciseModal
               exercise={selectedExercise}
               onConfirm={handleConfirmDelete}
               onCancel={() => setShowDeleteModal(false)}
               title={t('delete_exercise_modal_title')}
               confirmationMessage={t('delete_exercise_confirmation', { exercise: selectedExercise })}
            />
         )}
      </div>
   );
};
