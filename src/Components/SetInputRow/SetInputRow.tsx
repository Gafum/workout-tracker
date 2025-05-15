import React from 'react';

interface ISetInputRowProps {
    set: { id: string; reps: string | number; weight?: string | number };
    index: number;
    inputClasses: string;
    isOnlySet: boolean; // To know if delete button should be shown
    onSetChange: (id: string, field: 'reps' | 'weight', value: string) => void;
    onDeleteSet: (id: string) => void;
}

export const SetInputRow: React.FC<ISetInputRowProps> = ({
    set,
    index,
    inputClasses,
    isOnlySet,
    onSetChange,
    onDeleteSet,
}) => {
    return (
        <div className="flex items-center space-x-2 sm:space-x-3 py-1 rounded-md transition-colors hover:bg-gray-50/50">
            {/* Optional: Set Number Indicator */}
            {/* <span className="text-sm font-medium text-gray-400 w-7 text-center flex-shrink-0">
                {index + 1}.
            </span> */}

            {/* Reps Input */}
            <div className="flex-1 min-w-0">
                <label htmlFor={`reps-${set.id}`} className="sr-only">
                    Reps for set {index + 1}
                </label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id={`reps-${set.id}`}
                    value={set.reps}
                    onChange={(e) => onSetChange(set.id, 'reps', e.target.value)}
                    className={inputClasses}
                    placeholder="Reps"
                    required
                    maxLength={3}
                />
            </div>

            {/* Weight Input */}
            <div className="flex-1 min-w-0">
                <label htmlFor={`weight-${set.id}`} className="sr-only">
                    Weight for set {index + 1}
                </label>
                <input
                    type="text"
                    inputMode="decimal"
                    id={`weight-${set.id}`}
                    value={set.weight ?? ''} // Ensure value is not undefined/null for input
                    onChange={(e) => onSetChange(set.id, 'weight', e.target.value)}
                    className={inputClasses}
                    placeholder="Weight (kg)"
                />
            </div>

            {/* Delete Set Button */}
            {!isOnlySet && (
                <button
                    type="button"
                    onClick={() => onDeleteSet(set.id)}
                    className="p-2.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors duration-150 ease-in-out flex-shrink-0"
                    aria-label={`Delete set ${index + 1}`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};