'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, Clock, ChevronLeft, ChevronRight, X } from 'lucide-react';

interface DateTimePickerProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export default function DateTimePicker({ value, onChange, placeholder = 'Chọn ngày giờ', className = '' }: DateTimePickerProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [viewDate, setViewDate] = useState(() => {
        if (value) return new Date(value);
        return new Date();
    });
    const [selectedDate, setSelectedDate] = useState<Date | null>(() => {
        if (value) return new Date(value);
        return null;
    });
    const [hours, setHours] = useState(() => {
        if (value) return new Date(value).getHours();
        return 23;
    });
    const [minutes, setMinutes] = useState(() => {
        if (value) return new Date(value).getMinutes();
        return 59;
    });

    const containerRef = useRef<HTMLDivElement>(null);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0 = Sunday

    const monthNames = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
        'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];
    const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

    const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
    const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

    const selectDay = (day: number) => {
        const newDate = new Date(year, month, day, hours, minutes);
        setSelectedDate(newDate);
    };

    const applySelection = () => {
        if (!selectedDate) return;
        const d = new Date(selectedDate);
        d.setHours(hours, minutes, 0, 0);
        // Format to datetime-local format: YYYY-MM-DDTHH:mm
        const pad = (n: number) => n.toString().padStart(2, '0');
        const formatted = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(hours)}:${pad(minutes)}`;
        onChange(formatted);
        setIsOpen(false);
    };

    const clearValue = (e: React.MouseEvent) => {
        e.stopPropagation();
        onChange('');
        setSelectedDate(null);
        setIsOpen(false);
    };

    const displayValue = value
        ? new Date(value).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
        : '';

    const isSelectedDay = (day: number) => {
        if (!selectedDate) return false;
        return selectedDate.getDate() === day &&
            selectedDate.getMonth() === month &&
            selectedDate.getFullYear() === year;
    };

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === month &&
            today.getFullYear() === year;
    };

    // Build calendar grid
    const cells: (number | null)[] = [];
    for (let i = 0; i < firstDayOfWeek; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(d);

    return (
        <div ref={containerRef} className={`relative ${className}`}>
            {/* Trigger button */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-xl text-sm text-left transition-colors hover:border-brand-400 dark:hover:border-brand-500"
            >
                <span className={displayValue ? 'text-surface-900 dark:text-surface-100' : 'text-surface-400'}>
                    {displayValue || placeholder}
                </span>
                <div className="flex items-center gap-1">
                    {value && (
                        <span
                            onClick={clearValue}
                            className="p-0.5 hover:bg-surface-200 dark:hover:bg-surface-700 rounded transition-colors"
                        >
                            <X className="w-3.5 h-3.5 text-surface-400" />
                        </span>
                    )}
                    <Calendar className="w-4 h-4 text-surface-400 flex-shrink-0" />
                </div>
            </button>

            {/* Dropdown calendar */}
            {isOpen && (
                <div className="absolute z-50 mt-1 bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 rounded-xl shadow-xl p-4 w-[300px] animate-in fade-in slide-in-from-top-2 duration-200">
                    {/* Month navigation */}
                    <div className="flex items-center justify-between mb-3">
                        <button type="button" onClick={prevMonth} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
                            <ChevronLeft className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                        </button>
                        <span className="text-sm font-semibold text-surface-900 dark:text-surface-100">
                            {monthNames[month]} {year}
                        </span>
                        <button type="button" onClick={nextMonth} className="p-1 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors">
                            <ChevronRight className="w-4 h-4 text-surface-600 dark:text-surface-400" />
                        </button>
                    </div>

                    {/* Day headers */}
                    <div className="grid grid-cols-7 gap-0.5 mb-1">
                        {dayNames.map(d => (
                            <div key={d} className="text-center text-xs font-medium text-surface-400 py-1">{d}</div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div className="grid grid-cols-7 gap-0.5 mb-4">
                        {cells.map((day, i) => (
                            <div key={i} className="aspect-square flex items-center justify-center">
                                {day ? (
                                    <button
                                        type="button"
                                        onClick={() => selectDay(day)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all
                                            ${isSelectedDay(day)
                                                ? 'bg-brand-600 text-white shadow-sm'
                                                : isToday(day)
                                                    ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-300'
                                                    : 'text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800'
                                            }`}
                                    >
                                        {day}
                                    </button>
                                ) : null}
                            </div>
                        ))}
                    </div>

                    {/* Time selector */}
                    <div className="border-t border-surface-200 dark:border-surface-700 pt-3">
                        <div className="flex items-center gap-2 mb-3">
                            <Clock className="w-4 h-4 text-surface-400" />
                            <span className="text-xs font-medium text-surface-500">Giờ hết hạn</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="flex items-center gap-1">
                                <input
                                    type="number"
                                    min={0}
                                    max={23}
                                    value={hours.toString().padStart(2, '0')}
                                    onChange={(e) => setHours(Math.min(23, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-14 px-2 py-1.5 text-center bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-mono font-semibold text-surface-900 dark:text-surface-100"
                                />
                                <span className="text-surface-400 font-bold">:</span>
                                <input
                                    type="number"
                                    min={0}
                                    max={59}
                                    value={minutes.toString().padStart(2, '0')}
                                    onChange={(e) => setMinutes(Math.min(59, Math.max(0, parseInt(e.target.value) || 0)))}
                                    className="w-14 px-2 py-1.5 text-center bg-surface-50 dark:bg-surface-950 border border-surface-200 dark:border-surface-700 rounded-lg text-sm font-mono font-semibold text-surface-900 dark:text-surface-100"
                                />
                            </div>
                            <button
                                type="button"
                                onClick={applySelection}
                                disabled={!selectedDate}
                                className="ml-auto px-4 py-1.5 bg-brand-600 hover:bg-brand-700 disabled:bg-surface-300 dark:disabled:bg-surface-700 text-white text-sm font-medium rounded-lg transition-colors disabled:cursor-not-allowed"
                            >
                                Chọn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
