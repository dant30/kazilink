import React from 'react';

interface BadgeProps {
  variant?: 'verified' | 'orange' | 'success' | 'warning' | 'info' | 'neutral';
  size?: 'sm' | 'md';
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  icon,
  className = '',
}) => {
  const sizeStyles = {
    sm: 'text-[11px] px-2 py-0.5 rounded-md gap-1',
    md: 'text-xs px-2.5 py-1 rounded-lg gap-1.5 font-medium',
  }[size];

  const variantStyles = {
    verified: 'bg-[#0A2540] text-white font-semibold',
    orange: 'bg-[#FFF4EB] text-[#FF6B00] border border-[#FED7AA] font-semibold',
    success: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border border-amber-200',
    info: 'bg-sky-50 text-sky-700 border border-sky-200',
    neutral: 'bg-slate-100 text-slate-700 border border-slate-200',
  }[variant];

  return (
    <span className={`inline-flex items-center select-none ${sizeStyles} ${variantStyles} ${className}`}>
      {icon}
      <span>{children}</span>
    </span>
  );
};
