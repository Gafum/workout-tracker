import React, { useState } from 'react';
import CalendarScroll from '../Components/Calendar/CalendarScroll';
import { format } from 'date-fns';

export const Home: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [activeMode, setActiveMode] = useState<'weight' | 'exercise'>('exercise');

  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-green-600">Workout Tracker</h1>
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-lg ${
              activeMode === 'weight' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveMode('weight')}
          >
            Weight/Food
          </button>
          <button 
            className={`px-4 py-2 rounded-lg ${
              activeMode === 'exercise' 
                ? 'bg-green-500 text-white' 
                : 'bg-gray-200 text-gray-700'
            }`}
            onClick={() => setActiveMode('exercise')}
          >
            Exercise
          </button>
        </div>
      </div>

      <CalendarScroll 
        selectedDate={selectedDate}
        onDateChange={handleDateChange}
      />

      <div className="bg-white rounded-lg p-4 shadow-sm">
        <h2 className="text-xl font-bold text-green-600 mb-4">
          {activeMode === 'exercise' 
            ? `Log Exercise for ${format(selectedDate, 'MM/dd/yyyy')}` 
            : `Log Weight for ${format(selectedDate, 'MM/dd/yyyy')}`}
        </h2>
        
        {/* Content based on active mode */}
        {activeMode === 'weight' ? (
          <div>
            {/* Weight/Food tracking UI */}
            <p>Weight/Food tracking content will go here</p>
          </div>
        ) : (
          <div>
            {/* Exercise tracking UI */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Exercise Name</label>
              <input 
                type="text" 
                placeholder="e.g., Bench Press" 
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2">Sets</label>
                <input 
                  type="number" 
                  placeholder="e.g., 3" 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  max={300}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Reps</label>
                <input 
                  type="number" 
                  placeholder="e.g., 10" 
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  max={300}
                />
              </div>
            </div>
            
            <button className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
              Add Exercise
            </button>
            
            <div className="mt-6">
              <h3 className="font-bold text-gray-700 mb-2">Logged Today:</h3>
              <p className="text-gray-500">No exercises logged for this day yet.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;