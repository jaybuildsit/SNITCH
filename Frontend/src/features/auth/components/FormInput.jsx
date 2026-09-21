
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
      {label && (
        <label
          htmlFor={id}
          className="block text-[10px] font-semibold tracking-[0.14em] uppercase text-neutral-400 mb-2 select-none"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 flex items-center justify-center pointer-events-none text-neutral-300">
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
          className={`w-full px-3.5 py-[10px] text-[14px] bg-white border rounded-md text-neutral-900 placeholder:text-neutral-300 focus:outline-none transition-all duration-150 ${
            icon ? 'pl-10' : 'pl-3.5'
          } ${
            error
              ? 'border-rose-300 focus:border-rose-400 focus:ring-2 focus:ring-rose-100'
              : 'border-neutral-200 hover:border-neutral-300 focus:border-neutral-800 focus:ring-2 focus:ring-neutral-100'
          }`}
          {...rest}
        />
      </div>

      {error && (
        <p className="mt-1.5 text-[11px] text-rose-500 flex items-center gap-1">
          <svg
            className="w-3 h-3 shrink-0"
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
