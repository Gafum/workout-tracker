import React from "react";
import { updateExerciseName } from "../../Utils/LocalStorageUtils";
import { useLanguage } from "../../Context/LanguageContext";

interface EditExerciseModalProps {
  exercise: string;
  newName: string;
  setNewName: (name: string) => void;
  onSave: () => void;
  onCancel: () => void;
  title?: string; // Optional, will use default if not provided
}

export const EditExerciseModal: React.FC<EditExerciseModalProps> = ({
  exercise,
  newName,
  setNewName,
  onSave,
  onCancel,
  title // Use translation as default
}) => {
  const { t } = useLanguage();
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newName.trim() === "") {
      alert("Exercise name cannot be empty");
      return;
    }
    updateExerciseName(exercise, newName.trim());
    onSave();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-brand-text mb-4">
          {title}
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="exerciseName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              {t('exercise_name')}
            </label>
            <input
              type="text"
              id="exerciseName"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="block w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-sm shadow-sm placeholder-gray-400 transition-colors duration-150 ease-in-out focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green focus:bg-white"
              autoFocus
            />
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-brand-green hover:bg-brand-green-dark rounded-md transition-colors"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};