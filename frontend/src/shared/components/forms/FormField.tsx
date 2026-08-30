// frontend/src/shared/components/forms/FormField.tsx
import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  helperText?: string;
  children: React.ReactNode;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required,
  error,
  helperText,
  children,
}) => {
  return (
    <div className="space-y-1.5 text-left">
      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
        {label} {required && <span className="text-[#FF6B00]">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-rose-600 font-medium">{error}</p>}
      {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
    </div>
  );
};
