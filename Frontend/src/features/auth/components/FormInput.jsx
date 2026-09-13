import React from 'react';

export const FormInput = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  placeholder,
  icon,
  error,
  autoComplete,
  required = false,
  ...rest
}) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1.5">
        <label
          htmlFor={id}
          className="block text-[11px] font-bold tracking-wider text-slate-700 uppercase select-none"
        >
          {label}
        </label>
      </div>

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-slate-400">
            {icon}
          </div>
        )}

        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`w-full h-[52px] bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium rounded-xl border transition-all duration-200 outline-none ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 bg-red-50/10'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15'
          }`}
          {...rest}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-xs font-medium text-red-500 flex items-center gap-1 animate-fadeIn">
          <svg
            className="w-3.5 h-3.5 shrink-0"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <span>{error}</span>
        </p>
      )}
    </div>
  );
};

export default FormInput;
