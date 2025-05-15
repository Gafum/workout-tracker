import React from 'react';

// Type for the set data passed to this component (uses strings for input values)
interface IFormSet {
    id: string;
    reps: string;
    weight: string;
}

interface ISetInputRowProps {
    set: IFormSet;
    index: number;
    inputClasses: string; // Receive enhanced classes from parent
    isOnlySet: boolean;
    onSetChange: (id: string, field: 'reps' | 'weight', value: string) => void;
    onDeleteSet: (id: string) => void;
}

export const SetInputRow: React.FC<ISetInputRowProps> = ({
    set,
    index,
    inputClasses, // Use the enhanced classes passed down
    isOnlySet,
    onSetChange,
    onDeleteSet,
}) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        onSetChange(set.id, name as 'reps' | 'weight', value);
    };

    const handleDeleteClick = () => {
        if (!isOnlySet) {
            onDeleteSet(set.id);
        }
    };


    return (
        // Slightly reduced horizontal spacing for mobile
        <div className="flex items-center space-x-2">
            {/* Set Number - slightly smaller width */}
            <span className="text-sm font-medium text-gray-500 w-5 text-right flex-shrink-0">{index + 1}.</span>

            {/* Reps Input */}
            <div className="flex-1 min-w-0"> {/* Added min-w-0 for flex shrink issues */}
                <label htmlFor={`reps-${set.id}`} className="sr-only">Reps for set {index + 1}</label>
                <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    id={`reps-${set.id}`}
                    name="reps"
                    value={set.reps}
                    onChange={handleInputChange}
                    // Use passed inputClasses, ensure text is centered
                    className={`${inputClasses} text-center w-full`}
                    placeholder="Reps"
                    aria-label={`Reps for set ${index + 1}`}
                    required
                />
            </div>

            {/* Weight Input */}
            <div className="flex-1 min-w-0"> {/* Added min-w-0 */}
                 <label htmlFor={`weight-${set.id}`} className="sr-only">Weight for set {index + 1}</label>
                <input
                    type="text"
                    inputMode="decimal"
                    id={`weight-${set.id}`}
                    name="weight"
                    value={set.weight}
                    onChange={handleInputChange}
                     // Use passed inputClasses, ensure text is centered
                    className={`${inputClasses} text-center w-full`}
                    placeholder="Weight (kg)"
                     aria-label={`Weight in kg for set ${index + 1}`}
                />
            </div>

            {/* Delete Button - ensure it's easy to tap */}
            <div className="flex-shrink-0">
                <button
                    type="button"
                    onClick={handleDeleteClick}
                    disabled={isOnlySet}
                    // Increased padding slightly for easier tap target
                    className={`p-2 rounded-full transition-colors duration-150 ease-in-out ${
                        isOnlySet
                            ? 'text-gray-300 cursor-not-allowed'
                            // Enhanced focus state
                            : 'text-gray-400 hover:text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-400'
                    }`}
                    aria-label={`Delete set ${index + 1}`}
                >
                    {/* Icon size remains appropriate */}
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    );
};