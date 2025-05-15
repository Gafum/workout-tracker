import React, { useState, useEffect } from 'react';
import { IDailyWeight } from '../../Types/AppTypes';
import { loadWeightForDay, saveWeightForDay } from '../../Utils/LocalStorageUtils';

interface IWeightProps {
    selectedDate: Date;
}

export const Weight: React.FC<IWeightProps> = ({ selectedDate }) => {
    const [morningWeight, setMorningWeight] = useState<string | number>('');
    const [eveningWeight, setEveningWeight] = useState<string | number>('');
    const [error, setError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Function to find the most recent weight data
    const findMostRecentWeightData = (): { morningWeight: number | null, eveningWeight: number | null } | null => {
        // Start from today and go backwards
        const today = new Date();
        const startDate = new Date(today);
        startDate.setFullYear(today.getFullYear() - 1); // Look back up to 1 year
        
        let currentDate = new Date(today);
        
        while (currentDate >= startDate) {
            const data = loadWeightForDay(currentDate);
            if (data && (data.morningWeight !== null || data.eveningWeight !== null)) {
                return data;
            }
            // Move to previous day
            currentDate.setDate(currentDate.getDate() - 1);
        }
        
        return null; // No data found in the past year
    };

    // Load weight data when the selected date changes
    useEffect(() => {
        const loadedWeight = loadWeightForDay(selectedDate);
        
        if (loadedWeight && (loadedWeight.morningWeight !== null || loadedWeight.eveningWeight !== null)) {
            // If we have data for the selected date, use it
            setMorningWeight(loadedWeight.morningWeight ?? '');
            setEveningWeight(loadedWeight.eveningWeight ?? '');
        } else {
            // If no data for selected date, try to find most recent data
            const recentWeight = findMostRecentWeightData();
            if (recentWeight) {
                setMorningWeight(recentWeight.morningWeight ?? '');
                setEveningWeight(recentWeight.eveningWeight ?? '');
            } else {
                // No recent data found, use empty values
                setMorningWeight('');
                setEveningWeight('');
            }
        }
        
        setError(null); // Clear errors on date change
        setSuccessMessage(null); // Clear success message on date change
    }, [selectedDate]);

    // Validate input (allow empty or positive numbers)
    const validateWeight = (value: string | number): boolean => {
        if (value === '') return true; // Allow empty input
        const num = Number(value);
        return !isNaN(num) && num > 0 && num <= 500; // Basic validation (adjust max as needed)
    };

    // Handle saving weight data
    const handleSaveWeight = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setSuccessMessage(null);

        const morningValid = validateWeight(morningWeight);
        const eveningValid = validateWeight(eveningWeight);

        if (!morningValid || !eveningValid) {
            setError('Weight must be a positive number (up to 500) or empty.');
            return;
        }

        // Prepare data, converting empty strings to null for storage
        const weightDataToSave: Omit<IDailyWeight, 'date'> = {
            morningWeight: morningWeight === '' ? null : Number(morningWeight),
            eveningWeight: eveningWeight === '' ? null : Number(eveningWeight),
        };

        try {
            saveWeightForDay(selectedDate, weightDataToSave);
            setSuccessMessage('Weight saved successfully!');
            // Clear success message after a few seconds
            setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
            console.error("Error saving weight:", err);
            setError('Failed to save weight data.');
        }
    };

    const inputClasses = "mt-1 block w-full px-3 py-2 bg-white border border-brand-border rounded-md text-sm shadow-sm placeholder-gray-400 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green";

    return (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-brand-border">
            <h2 className="text-xl font-semibold text-brand-green-dark mb-4">Log Weight for {selectedDate.toLocaleDateString()}</h2>

            <form onSubmit={handleSaveWeight} className="space-y-4">
                {/* Morning Weight Input */}
                <div>
                    <label htmlFor="morningWeight" className="block text-sm font-medium text-gray-700">Morning Weight (kg)</label>
                    <input
                        type="number"
                        id="morningWeight"
                        value={morningWeight}
                        onChange={(e) => setMorningWeight(e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 75.5"
                        step="0.1" // Allow decimals
                        min="0"
                        max="500" // Example max
                    />
                </div>

                {/* Evening Weight Input */}
                <div>
                    <label htmlFor="eveningWeight" className="block text-sm font-medium text-gray-700">Evening Weight (kg)</label>
                    <input
                        type="number"
                        id="eveningWeight"
                        value={eveningWeight}
                        onChange={(e) => setEveningWeight(e.target.value)}
                        className={inputClasses}
                        placeholder="e.g., 76.2"
                        step="0.1"
                        min="0"
                        max="500"
                    />
                </div>

                {/* Error Message */}
                {error && <p className="text-sm text-red-600">{error}</p>}

                {/* Success Message */}
                {successMessage && <p className="text-sm text-green-600">{successMessage}</p>}


                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full px-4 py-2 bg-brand-green text-white font-medium rounded-md shadow-sm hover:bg-brand-green-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-green transition duration-150 ease-in-out"
                >
                    Save Weight
                </button>
            </form>
        </div>
    );
};