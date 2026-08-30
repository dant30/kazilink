import React from 'react';
import { ChevronDown } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: (Option | string)[];
  value: string;
  onChange: (value: string) => void;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

export const Select: React.FC<SelectProps> = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  required,
  className = '',
  disabled,
  ...props
}) => {
  return (
    <div className={`space-y-1 text-left ${className}`}>
      {label && (
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
          {label} {required && <span className="text-[#FF6B00]">*</span>}
        </label>
      )}

      <div className="relative">
        <select
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none px-3.5 py-2.5 bg-slate-50 border rounded-xl text-sm font-medium text-slate-900 transition focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-[#0A2540]/20 ${
            error
              ? 'border-rose-500 focus:border-rose-500'
              : 'border-slate-300 focus:border-[#0A2540]'
          } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
          {...props}
        >
          {options.map((opt, idx) => {
            if (typeof opt === 'string') {
              return (
                <option key={idx} value={opt}>
                  {opt}
                </option>
              );
            }
            return (
              <option key={idx} value={opt.value} disabled={opt.disabled}>
                {opt.label} {opt.sublabel ? `(${opt.sublabel})` : ''}
              </option>
            );
          })}
        </select>

        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-slate-400">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>

      {error && <p className="text-[11px] font-medium text-rose-600">{error}</p>}
      {helperText && !error && <p className="text-[11px] text-slate-500">{helperText}</p>}
    </div>
  );
};
