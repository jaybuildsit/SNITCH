import React from 'react';

export const SellerCheckbox = ({
  checked = false,
  onChange,
  id = 'isSeller',
  name = 'isSeller',
}) => {
  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange({ target: { name, checked: !checked, type: 'checkbox' } });
    }
  };

  return (
    <div
      onClick={() =>
        onChange({ target: { name, checked: !checked, type: 'checkbox' } })
      }
      onKeyDown={handleKeyDown}
      role="checkbox"
      aria-checked={checked}
      tabIndex={0}
      className={`group relative flex items-start gap-3.5 p-3.5 rounded-xl border transition-all duration-200 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2 ${
        checked
          ? 'bg-indigo-50/60 border-indigo-200'
          : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300'
      }`}
    >
      <div className="pt-0.5 shrink-0">
        <div
          className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all duration-200 ${
            checked
              ? 'bg-gradient-to-br from-indigo-600 to-violet-600 border-transparent shadow-sm'
              : 'bg-white border-slate-300 group-hover:border-indigo-400 shadow-2xs'
          }`}
        >
          <svg
            className={`w-3.5 h-3.5 text-white stroke-[2.5] transition-transform duration-200 ${
              checked ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
        </div>
      </div>

      <div className="flex flex-col">
        <span
          className={`text-sm font-semibold transition-colors duration-150 ${
            checked ? 'text-indigo-950' : 'text-slate-800'
          }`}
        >
          I am a seller
        </span>
        <span className="text-xs text-slate-500 mt-0.5 leading-relaxed">
          Register as a seller on SNITCH to manage storefront and listings
        </span>
      </div>

      {/* Screen-reader accessible hidden native input */}
      <input
        type="checkbox"
        id={id}
        name={name}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        tabIndex={-1}
        aria-hidden="true"
      />
    </div>
  );
};

export default SellerCheckbox;
