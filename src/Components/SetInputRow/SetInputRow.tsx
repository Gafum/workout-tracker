import React from 'react';

interface ISetInputRowProps {
    set: { id: string; reps: string | number; weight?: string | number; notes?: string }; // Add notes to set type
    index: number;
    inputClasses: string;
    isOnlySet: boolean; // To know if delete button should be shown
    onSetChange: (id: string, field: 'reps' | 'weight' | 'notes', value: string) => void; // Add 'notes' to field type
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
        // Use flex-col on small screens and flex-row on sm and up for the main row container
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3 py-1 rounded-md transition-colors hover:bg-gray-50/50">
            {/* Reps and Weight container - stays in a row on all screens, but allows notes to wrap below on mobile */}
            <div className="flex flex-1 items-center space-x-2 sm:space-x-3">
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
            </div>

            {/* Notes Input - full width on mobile (due to flex-col on parent), takes available space on desktop */}
            <div className="flex-1 min-w-0 w-full sm:w-auto sm:flex-grow-[2]"> {/* Allow notes to take more space on larger screens, ensure w-full for mobile stacking */}
                <label htmlFor={`notes-${set.id}`} className="sr-only">
                    Notes for set {index + 1}
                </label>
                <input
                    type="text"
                    id={`notes-${set.id}`}
                    value={set.notes ?? ''} // Ensure value is not undefined/null for input
                    onChange={(e) => onSetChange(set.id, 'notes', e.target.value)}
                    className={`${inputClasses} w-full`} // Ensure w-full for the input itself
                    placeholder="Notes (e.g., EZ bar, 10s hold)"
                    maxLength={100} // Optional: set a max length for notes
                />
            </div>

            {/* Delete Set Button - ensure it aligns correctly with flex layout */}
            {!isOnlySet && (
                <button
                    type="button"
                    onClick={() => onDeleteSet(set.id)}
                    // Adjusted padding for better alignment, self-end for flex-col, sm:self-center for flex-row
                    className="p-2.5 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-100 transition-colors duration-150 ease-in-out flex-shrink-0 self-end sm:self-center"
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