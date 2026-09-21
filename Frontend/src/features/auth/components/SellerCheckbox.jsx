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
      className={`group relative flex items-start gap-3 p-3 rounded-md border transition-all duration-150 cursor-pointer select-none outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 focus-visible:ring-offset-1 ${
        checked
          ? 'bg-neutral-50 border-neutral-800'
          : 'bg-neutral-50/40 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/80'
      }`}
    >
      <div className="pt-0.5 shrink-0">
        <div
          className={`w-4 h-4 rounded-[4px] flex items-center justify-center border transition-all duration-150 ${
            checked
              ? 'bg-neutral-950 border-neutral-950 text-white'
              : 'bg-white border-neutral-300 group-hover:border-neutral-400'
          }`}
        >
          <svg
            className={`w-2.5 h-2.5 stroke-[2.5] transition-transform duration-150 ${
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
        <span className="text-[13px] font-medium text-neutral-900">
          I'm registering as a seller
        </span>
        <span className="text-[11px] text-neutral-400 font-normal mt-0.5 leading-snug">
          Create and manage your brand listings in the SNITCH Seller Studio
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
