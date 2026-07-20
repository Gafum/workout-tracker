import React from "react";
import { TypeAppMode } from "../../Types/AppTypes";
import { FaWeightHanging, FaDumbbell, FaListUl } from 'react-icons/fa';
import { useAppContext } from "../../Context/AppContext";
import { useLanguage } from "../../Context/LanguageContext";

interface IMobileNavProps {
    onModeChange: (mode: TypeAppMode) => void;
    onPlansClick?: () => void;
}

export const MobileNav: React.FC<IMobileNavProps> = ({ onModeChange, onPlansClick }) => {
    const { activePage } = useAppContext();
    const { t } = useLanguage();

    const getButtonClasses = (page: string) => {
        const baseClasses = "flex flex-col items-center justify-center flex-1 py-3 text-xs sm:text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green";

        if (page === activePage) {
            return `${baseClasses} bg-brand-green text-white font-semibold`;
        }
        return `${baseClasses} bg-white text-gray-500 hover:text-brand-green-dark`;
    };

    return (
        // Adjusted height slightly, added subtle top shadow
        <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t border-gray-200 shadow-[-1px_-4px_6px_-1px_rgba(0,0,0,0.05),0_-2px_4px_-2px_rgba(0,0,0,0.04)] flex z-20">
            <button
                onClick={() => onModeChange('weight')}
                className={getButtonClasses('weight')}
            >
                <FaWeightHanging className="w-5 h-5 mb-1" />
                <span>{t("weight_food")}</span>
            </button>
            <button
                onClick={() => onModeChange('exercise')}
                className={getButtonClasses('exercise')}
            >
                <FaDumbbell className="w-5 h-5 mb-1" />
                <span>{t("exercise")}</span>
            </button>
            <button
                onClick={() => onPlansClick?.()}
                className={getButtonClasses('plans')}
            >
                <FaListUl className="w-5 h-5 mb-1" />
                <span>{t("plans.title")}</span>
            </button>
        </nav>
    );
};