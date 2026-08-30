import React from 'react';

interface ProgressBarProps {
  value: number; // 0 to 100
  label?: string;
  showPercentage?: boolean;
  color?: 'navy' | 'orange' | 'emerald';
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  label,
  showPercentage = true,
  color = 'navy',
  className = '',
}) => {
  const clampedValue = Math.min(100, Math.max(0, value));

  const colorStyles = {
    navy: 'bg-[#0A2540]',
    orange: 'bg-[#FF6B00]',
    emerald: 'bg-emerald-600',
  }[color];

  return (
    <div className={`w-full space-y-1.5 ${className}`}>
      {(label || showPercentage) && (
        <div className="flex justify-between items-center text-xs font-medium text-slate-600">
          {label && <span>{label}</span>}
          {showPercentage && <span>{clampedValue}%</span>}
        </div>
      )}
      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${colorStyles} transition-all duration-500 rounded-full`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
};
