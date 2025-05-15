import React from 'react';
import { TypeAppMode } from '../../Types/AppTypes';
// Import icons
import { FaWeightHanging, FaDumbbell } from 'react-icons/fa';

interface IMobileNavProps {
    currentMode: TypeAppMode;
    onModeChange: (mode: TypeAppMode) => void;
}

export const MobileNav: React.FC<IMobileNavProps> = ({ currentMode, onModeChange }) => {
    const getButtonClasses = (mode: TypeAppMode) => {
        // Adjusted base classes: slightly larger text, more padding
        const baseClasses = "flex flex-col items-center justify-center flex-1 py-3 text-xs sm:text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-brand-green"; // Added focus styles
        if (mode === currentMode) {
            // Active state: brand color background, white text, slightly bolder font
            return `${baseClasses} bg-brand-green text-white font-semibold`;
        }
        // Inactive state: subtle gray, brighter green on hover
        return `${baseClasses} text-gray-500 hover:text-brand-green-dark`;
    };

    return (
        // Adjusted height slightly, added subtle top shadow
        <nav className="fixed bottom-0 left-0 right-0 h-[68px] bg-white border-t border-gray-200 shadow-[-1px_-4px_6px_-1px_rgba(0,0,0,0.05),0_-2px_4px_-2px_rgba(0,0,0,0.04)] flex z-20">
            <button
                onClick={() => onModeChange('weight')}
                className={getButtonClasses('weight')}
                aria-current={currentMode === 'weight' ? 'page' : undefined} // Accessibility improvement
            >
                {/* Added Icon */}
                <FaWeightHanging className="w-5 h-5 mb-1" />
                <span>Weight/Food</span>
            </button>
            <button
                onClick={() => onModeChange('exercise')}
                className={getButtonClasses('exercise')}
                aria-current={currentMode === 'exercise' ? 'page' : undefined} // Accessibility improvement
            >
                 {/* Added Icon */}
                <FaDumbbell className="w-5 h-5 mb-1" />
                <span>Exercise</span>
            </button>
        </nav>
    );
};