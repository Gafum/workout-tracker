import React from "react";
import { useLanguage } from "../../Context/LanguageContext"; // Add this import

interface IDeleteConfirmationModalProps {
   isOpen: boolean;
   onClose: () => void;
   onConfirm: () => void;
   exerciseName: string;
}

export const DeleteConfirmationModal: React.FC<
   IDeleteConfirmationModalProps
> = ({ isOpen, onClose, onConfirm, exerciseName }) => {
   const { t } = useLanguage(); // Add this line to use translations
   
   if (!isOpen) return null;

   return (
      <div
         className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 mt-0 px-[18px]"
         style={{ margin: 0 }}
      >
         <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
               {t("confirm_deletion")}
            </h3>
            <p className="text-sm text-gray-600 mb-6">
               {t("delete_exercise_confirmation", { name: exerciseName })}
            </p>
            <div className="flex flex-col sm:flex-row justify-end gap-2">
               <button
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors w-full"
               >
                  {t("cancel")}
               </button>
               <button
                  onClick={() => {
                     onConfirm();
                     onClose(); // Close modal after confirmation
                  }}
                  className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors w-full"
               >
                  {t("delete")}
               </button>
            </div>
         </div>
      </div>
   );
};
