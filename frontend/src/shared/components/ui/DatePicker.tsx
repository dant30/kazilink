import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, X, Clock } from 'lucide-react';

interface DatePickerProps {
  label?: string;
  value?: string; // Format YYYY-MM-DD
  onChange: (dateStr: string) => void;
  placeholder?: string;
  minDate?: string; // Format YYYY-MM-DD
  maxDate?: string;
  required?: boolean;
  className?: string;
  helperText?: string;
  quickPresets?: boolean;
  disabled?: boolean;
}

export const DatePicker: React.FC<DatePickerProps> = ({
  label,
  value = '',
  onChange,
  placeholder = 'Select Date',
  minDate,
  maxDate,
  required = false,
  className = '',
  helperText,
  quickPresets = true,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse current date or value
  const initialDate = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth()); // 0-indexed

  useEffect(() => {
    if (value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    }
  }, [value]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Days calculations
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const daysInPrevMonth = new Date(viewYear, viewMonth, 0).getDate();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(prev => prev - 1);
    } else {
      setViewMonth(prev => prev - 1);
    }
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(prev => prev + 1);
    } else {
      setViewMonth(prev => prev + 1);
    }
  };

  const formatDateString = (year: number, month: number, day: number) => {
    const mm = String(month + 1).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  };

  const handleSelectDay = (day: number) => {
    const dateStr = formatDateString(viewYear, viewMonth, day);
    onChange(dateStr);
    setIsOpen(false);
  };

  const setPreset = (preset: 'today' | 'tomorrow' | 'weekend' | 'nextMonth') => {
    const today = new Date();
    let target = new Date();
    if (preset === 'today') {
      target = today;
    } else if (preset === 'tomorrow') {
      target.setDate(today.getDate() + 1);
    } else if (preset === 'weekend') {
      // Find upcoming Friday / Saturday
      const day = today.getDay();
      const diff = day <= 5 ? 5 - day : (5 - day + 7);
      target.setDate(today.getDate() + diff);
    } else if (preset === 'nextMonth') {
      target = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    }

    const y = target.getFullYear();
    const m = target.getMonth();
    const d = target.getDate();
    onChange(formatDateString(y, m, d));
    setViewYear(y);
    setViewMonth(m);
    setIsOpen(false);
  };

  const displayFormatted = value ? new Date(value + 'T00:00:00').toLocaleDateString('en-KE', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  }) : '';

  return (
    <div className={`relative space-y-1 ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-[#FF6B00]">*</span>}
        </label>
      )}

      {/* Input Trigger */}
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-disabled={disabled}
        aria-expanded={isOpen}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        onKeyDown={(event) => {
          if (!disabled && (event.key === 'Enter' || event.key === ' ')) {
            event.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 border border-slate-300 rounded-xl text-sm transition focus-within:ring-2 focus-within:ring-[#0A2540]/20 ${disabled ? 'cursor-not-allowed bg-slate-100 opacity-60' : 'cursor-pointer bg-white hover:border-slate-400'}`}
      >
        <div className="flex items-center gap-2.5 text-slate-800 font-medium">
          <CalendarIcon className="w-4 h-4 text-[#FF6B00]" />
          {value ? (
            <span className="font-semibold text-slate-900">{displayFormatted}</span>
          ) : (
            <span className="text-slate-400 text-xs sm:text-sm">{placeholder}</span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {value && !disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onChange('');
              }}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
            Pick
          </span>
        </div>
      </div>

      {helperText && (
        <p className="text-[11px] text-slate-500">{helperText}</p>
      )}

      {/* Calendar Dropdown Popover */}
      {isOpen && !disabled && (
        <div className="absolute top-full left-0 mt-1.5 z-50 bg-white rounded-2xl shadow-2xl border border-slate-200 p-4 w-72 sm:w-80 animate-fade-in">
          
          {/* Quick Presets */}
          {quickPresets && (
            <div className="grid grid-cols-4 gap-1 pb-3 mb-3 border-b border-slate-100 text-[10px] font-bold text-slate-700">
              <button
                type="button"
                onClick={() => setPreset('today')}
                className="py-1 px-1.5 bg-slate-100 hover:bg-[#FF6B00] hover:text-white rounded-lg transition"
              >
                Today
              </button>
              <button
                type="button"
                onClick={() => setPreset('tomorrow')}
                className="py-1 px-1.5 bg-slate-100 hover:bg-[#FF6B00] hover:text-white rounded-lg transition"
              >
                Tomorrow
              </button>
              <button
                type="button"
                onClick={() => setPreset('weekend')}
                className="py-1 px-1.5 bg-slate-100 hover:bg-[#FF6B00] hover:text-white rounded-lg transition"
              >
                Weekend
              </button>
              <button
                type="button"
                onClick={() => setPreset('nextMonth')}
                className="py-1 px-1.5 bg-slate-100 hover:bg-[#FF6B00] hover:text-white rounded-lg transition"
              >
                Next Mo.
              </button>
            </div>
          )}

          {/* Month Header Navigation */}
          <div className="flex items-center justify-between mb-3 px-1">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label="Previous month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="text-xs font-black text-slate-900">
              {monthNames[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition"
              aria-label="Next month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week Header */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {daysOfWeek.map((day, i) => (
              <span key={i} className="text-[10px] font-bold text-slate-400 uppercase">
                {day}
              </span>
            ))}
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Prev month fill */}
            {Array.from({ length: firstDayIndex }).map((_, i) => (
              <span
                key={`prev-${i}`}
                className="text-[11px] text-slate-300 py-1.5"
              >
                {daysInPrevMonth - firstDayIndex + i + 1}
              </span>
            ))}

            {/* Current month days */}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = formatDateString(viewYear, viewMonth, day);
              const isSelected = value === dateStr;
              const isToday = formatDateString(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()) === dateStr;
              const isPast = minDate ? dateStr < minDate : false;
              const isAfterMax = maxDate ? dateStr > maxDate : false;
              const isDisabled = isPast || isAfterMax;

              return (
                <button
                  key={`day-${day}`}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleSelectDay(day)}
                  className={`text-xs py-1.5 rounded-lg font-semibold transition ${
                    isSelected
                      ? 'bg-[#0A2540] text-white font-bold shadow-xs'
                      : isToday
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : isDisabled
                      ? 'text-slate-300 cursor-not-allowed'
                      : 'text-slate-700 hover:bg-orange-50 hover:text-[#FF6B00]'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>

        </div>
      )}
    </div>
  );
};
