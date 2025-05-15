import { useState } from 'react';
import { Header } from './Components/Header/Header';
import { CalendarScroll } from './Components/Calendar/CalendarScroll';
import { WeightFood } from './Pages/WeightFood/WeightFood';
import { Exercise } from './Pages/Exercise/Exercise';
import { TypeAppMode } from './Types/AppTypes';
import { MobileNav } from './Components/MobileNav/MobileNav'; // Import MobileNav
import './index.css';

export const App = () => {
    const [currentMode, setCurrentMode] = useState<TypeAppMode>('exercise');
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleModeChange = (mode: TypeAppMode) => {
        setCurrentMode(mode);
    };

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
        console.log("Selected Date:", date.toDateString());
    };


    return (
        // Add pb-16 (padding-bottom: 4rem, height of MobileNav) to prevent content overlap on mobile
        // Add sm:pb-0 to remove the padding on larger screens
        <div className="container mx-auto p-4 max-w-screen-md min-h-screen flex flex-col pb-16 sm:pb-0">
            <Header currentMode={currentMode} onModeChange={handleModeChange} />

            <CalendarScroll
                selectedDate={selectedDate}
                onDateChange={handleDateChange}
                // Remove onCalendarOpen prop since it's not defined in ICalendarScrollProps interface
            />

            <main className="flex-grow">
                {currentMode === 'weight' && <WeightFood selectedDate={selectedDate} />}
                {currentMode === 'exercise' && <Exercise selectedDate={selectedDate}  />}
            </main>

            {/* Mobile Navigation - shown only on small screens */}
            <div className="sm:hidden"> {/* Wrapper div to apply sm:hidden */}
                <MobileNav currentMode={currentMode} onModeChange={handleModeChange} />
            </div>

            {/* Footer - always present for spacing, text visible on sm+ */}
            <footer className="text-center text-sm mt-8 py-4 border-t border-brand-border">
                <span className="text-gray-500 invisible sm:visible">Workout Tracker App</span> {/* Text invisible on mobile, visible on sm+ */}
            </footer>
        </div>
    );
};

export default App; // Keep default export for Vite HMR
