import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subMonths, parseISO } from 'date-fns';
import { de as deLocale, uk as ukLocale, ru as ruLocale } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { loadAllWeights } from '../../Utils/weightDataUtils';
import { convertWeight } from '../../Utils/metricDisplayUtils';
import { IUnitPreferences } from '../../Types/AppTypes';
import { useLanguage } from '../../Context/LanguageContext';

interface WeightChartProps {
    unitPreferences: IUnitPreferences;
    currentMorningWeight: string | null;
    currentEveningWeight: string | null;
    selectedDate: Date;
}

interface ChartDataPoint {
    date: string;
    rawDate: Date; // Add this to store the actual date object
    morningWeight: number | null;
    eveningWeight: number | null;
}

export const WeightChart: React.FC<WeightChartProps> = ({ 
    unitPreferences, 
    currentMorningWeight, 
    currentEveningWeight, 
    selectedDate 
}) => {
    const { t, language } = useLanguage();
    const [startDate, setStartDate] = useState<Date>(subMonths(new Date(), 6));
    const [endDate, setEndDate] = useState<Date>(new Date());
    const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

    // Define locale mapping
    const getLocale = () => {
        switch (language) {
            case 'de': return deLocale;
            case 'uk': return ukLocale;
            case 'ru': return ruLocale;
            default: return undefined;
        }
    };

    useEffect(() => {
        const allWeights = loadAllWeights();
        let data = Object.entries(allWeights)
            .map(([dateKey, entry]) => {
                const date = parseISO(dateKey);
                // Only include dates within the selected range
                if (date >= startDate && date <= endDate) {
                    const morningW = entry.morningWeight !== null
                        ? convertWeight(entry.morningWeight, 'kg', unitPreferences.weight)
                        : null;
                    const eveningW = entry.eveningWeight !== null
                        ? convertWeight(entry.eveningWeight, 'kg', unitPreferences.weight)
                        : null;
                    
                    // Only include points that have at least one weight value
                    if (morningW !== null || eveningW !== null) {
                        return {
                            date: format(date, 'dd.MM.yyyy', { locale: getLocale() }),
                            rawDate: date, // Store the actual date
                            morningWeight: morningW,
                            eveningWeight: eveningW
                        };
                    }
                }
                return null;
            })
            .filter((item): item is ChartDataPoint => item !== null)
            .sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());

        // Handle current day's data
        if (selectedDate >= startDate && selectedDate <= endDate) {
            const today = format(selectedDate, 'dd.MM.yyyy', { locale: getLocale() });
            const currentMorningW = currentMorningWeight ? 
                parseFloat(currentMorningWeight) : null;
            const currentEveningW = currentEveningWeight ? 
                parseFloat(currentEveningWeight) : null;

            // Only add current day if there's at least one weight value
            if (currentMorningW !== null || currentEveningW !== null) {
                // Remove existing entry for the selected date if it exists
                data = data.filter(item => format(item.rawDate, 'yyyy-MM-dd') !== format(selectedDate, 'yyyy-MM-dd'));
                
                // Add the current day's data
                data.push({
                    date: today,
                    rawDate: selectedDate,
                    morningWeight: currentMorningW,
                    eveningWeight: currentEveningW
                });

                // Re-sort the data to maintain chronological order
                data.sort((a, b) => a.rawDate.getTime() - b.rawDate.getTime());
            }
        }

        setChartData(data);
    }, [startDate, endDate, unitPreferences, currentMorningWeight, currentEveningWeight, selectedDate, t, language]);

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-gray-200 rounded shadow-sm">
                    <p className="text-sm font-medium">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p key={index} className="text-sm" style={{ color: entry.color }}>
                            {t(entry.name === 'Morning Weight' ? 'morning_weight' : 'evening_weight')}: {entry.value?.toFixed(1) || 'N/A'} {unitPreferences.weight}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="mt-6 p-4 bg-white rounded-lg shadow border border-gray-200">
            <h3 className="text-lg font-medium text-gray-900 mb-4">{t('weight_history')}</h3>
            
            <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">{t('from_date')}</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date: Date | null) => date && setStartDate(date)}
                        selectsStart
                        startDate={startDate}
                        endDate={endDate}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-gray-600">{t('to_date')}</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date: Date | null) => date && setEndDate(date)}
                        selectsEnd
                        startDate={startDate}
                        endDate={endDate}
                        minDate={startDate}
                        className="px-2 py-1 border border-gray-300 rounded text-sm"
                    />
                </div>
            </div>

            <div className="h-[300px]">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis
                                label={{ 
                                    value: t('weight_with_unit', { unit: unitPreferences.weight }),
                                    angle: -90,
                                    position: 'insideLeft'
                                }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="morningWeight"
                                name={t('morning_weight_label')}
                                stroke="#38A169"
                                dot={false}
                                connectNulls
                            />
                            <Line
                                type="monotone"
                                dataKey="eveningWeight"
                                name={t('evening_weight_label')}
                                stroke="#4C51BF"
                                dot={false}
                                connectNulls
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="h-full flex items-center justify-center text-gray-500">
                        {t('no_weight_data')}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WeightChart;