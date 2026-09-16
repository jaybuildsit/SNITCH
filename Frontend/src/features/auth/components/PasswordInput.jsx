import { useState } from 'react';

export const PasswordInput = ({
  label = 'PASSWORD',
  id = 'password',
  name = 'password',
  value,
  onChange,
  onBlur,
  placeholder = 'Create a strong password',
  error,
  autoComplete = 'new-password',
  required = false,
  ...rest
}) => {
  const [showPassword, setShowPassword] = useState(false);

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
        {/* Left lock icon */}
        <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-slate-400">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="1.75"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <input
          id={id}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          className={`w-full h-[52px] bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium rounded-xl border transition-all duration-200 outline-none pl-11 pr-12 ${
            error
              ? 'border-red-400 focus:border-red-500 focus:ring-4 focus:ring-red-500/15 bg-red-50/10'
              : 'border-slate-200 hover:border-slate-300 focus:border-indigo-600 focus:ring-4 focus:ring-indigo-600/15'
          }`}
          {...rest}
        />

        {/* Interactive Show/Hide Toggle */}
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18"
              />
            </svg>
          ) : (
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.75"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          )}
        </button>
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

export default PasswordInput;
