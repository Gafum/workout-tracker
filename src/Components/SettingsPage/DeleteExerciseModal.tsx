import React from "react";
import { removeExerciseName } from "../../Utils/LocalStorageUtils";

interface DeleteExerciseModalProps {
  exercise: string;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string; // Optional, will use default if not provided
  confirmationMessage?: string; // Optional, will use default if not provided
}

export const DeleteExerciseModal: React.FC<DeleteExerciseModalProps> = ({
  exercise,
  onConfirm,
  onCancel,
  title = "Delete Exercise", // Default value
  confirmationMessage = `Are you sure you want to delete "${exercise}" from your saved exercises? This cannot be undone.` // Default value
}) => {
  const handleDelete = () => {
    removeExerciseName(exercise);
    onConfirm();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
        <h3 className="text-lg font-semibold text-brand-text mb-4">
          {title}
        </h3>
        <p className="mb-6 text-gray-600">
          {confirmationMessage}
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-md transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};