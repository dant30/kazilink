import React, { useId } from 'react';
import { cn } from '../../../core/utils/cn';

export interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: React.ReactNode;
  iconBg?: string;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  changeType = 'neutral',
  icon,
  iconBg = 'bg-[#0A2540]/10 text-[#0A2540]',
  className,
}) => {
  const titleId = useId();
  const changeColors = {
    positive: 'text-emerald-600 bg-emerald-50',
    negative: 'text-rose-600 bg-rose-50',
    neutral: 'text-slate-600 bg-slate-100',
  }[changeType];

  return (
    <div aria-labelledby={titleId} className={cn('flex min-w-0 items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_-6px_rgba(10,37,64,0.22)] transition-shadow duration-200 hover:shadow-[0_8px_22px_-8px_rgba(10,37,64,0.3)]', className)}>
      <div className="min-w-0 space-y-1">
        <p id={titleId} className="truncate text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
        <p className="break-words text-2xl font-black text-slate-900">{value}</p>
        {(subtitle || change) && (
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            {change && (
              <span className={`rounded-md px-1.5 py-0.5 text-[11px] font-bold ${changeColors}`}>
                {change}
              </span>
            )}
            {subtitle && <span className="text-xs text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
      <div aria-hidden="true" className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${iconBg}`}>
        {icon}
      </div>
    </div>
  );
};
