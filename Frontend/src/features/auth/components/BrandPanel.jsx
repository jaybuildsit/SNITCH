const defaultRegisterFeatureCards = [
  {
    id: 1,
    title: "Discover what you love",
    description: "Explore products from brands and sellers worth knowing.",
    icon: (
      <svg
        className="w-4 h-4 text-indigo-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path
          strokeLinecap="round"
          d="m16 16 5 5"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Shop with confidence",
    description: "A simple and seamless experience from discovery to checkout.",
    icon: (
      <svg
        className="w-4 h-4 text-indigo-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1 5h13m-9-5v5m4-5v5"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Sell and grow",
    description: "Bring your products to more customers with SNITCH.",
    icon: (
      <svg
        className="w-4 h-4 text-indigo-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M5 10v9h14v-9M7 10V6h10v4M9 19v-5h6v5"
        />
      </svg>
    ),
  },
];

const loginFeatureCards = [
  {
    id: 1,
    title: "Discover what you love",
    description: "Explore products from brands and sellers worth knowing.",
    icon: (
      <svg
        className="w-4 h-4 text-indigo-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <circle cx="11" cy="11" r="6.5" />
        <path
          strokeLinecap="round"
          d="m16 16 5 5"
        />
      </svg>
    ),
  },
  {
    id: 2,
    title: "Shop with confidence",
    description: "A simple and seamless experience from discovery to checkout.",
    icon: (
      <svg
        className="w-4 h-4 text-indigo-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13 5.4 5M7 13l-1 5h13m-9-5v5m4-5v5"
        />
      </svg>
    ),
  },
  {
    id: 3,
    title: "Your marketplace, your way",
    description: "Shop your favorites or grow your business with SNITCH.",
    icon: (
      <svg
        className="w-4 h-4 text-indigo-100"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.8"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 10h18M5 10v9h14v-9M7 10V6h10v4M9 19v-5h6v5"
        />
      </svg>
    ),
  },
];

export const BrandPanel = ({
  variant = "register",
  eyebrow,
  headline,
  subheading,
  cards,
  footerPhrase = "Shop. Sell. Discover.",
}) => {
  const isLogin = variant === "login";

  const resolvedEyebrow =
    eyebrow || (isLogin ? "WELCOME BACK TO SNITCH" : "WELCOME TO SNITCH");

  const resolvedHeadline =
    headline ||
    (isLogin ? (
      <>
        Shop smarter.
        <br />
        Discover more.
      </>
    ) : (
      <>
        Discover more.
        <br />
        Shop smarter.
        <br />
        Sell better.
      </>
    ));

  const resolvedSubheading =
    subheading ||
    (isLogin
      ? "Sign in to continue discovering products, managing your orders, and growing your marketplace experience."
      : "Discover products you love, shop with confidence, and grow your business — all in one marketplace.");

  const resolvedCards =
    cards || (isLogin ? loginFeatureCards : defaultRegisterFeatureCards);
  return (
    <div className="relative flex h-full min-h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-[#101a46] via-[#1b1c5a] to-[#342078] px-8 py-8 sm:px-12 sm:py-10 lg:px-16 lg:py-12">
      
      {/* Ambient lighting */}
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -right-40 top-[35%] h-[600px] w-[600px] rounded-full bg-violet-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div
        className="pointer-events-none absolute -bottom-48 left-[20%] h-[500px] w-[500px] rounded-full bg-blue-500/15 blur-3xl"
        aria-hidden="true"
      />

      {/* Subtle decorative curve */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.12]"
        viewBox="0 0 800 1000"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-100 180C220 160 570 90 900 360C620 690 230 650-80 960"
          stroke="url(#brandCurve)"
          strokeWidth="2"
          strokeDasharray="8 10"
        />

        <defs>
          <linearGradient
            id="brandCurve"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#93c5fd" />
            <stop offset="50%" stopColor="#c4b5fd" />
            <stop offset="100%" stopColor="#818cf8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Brand */}
      <div className="relative z-10">
        <div className="flex items-center gap-3">
          
          {/* SNITCH Logo */}
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-white/10 backdrop-blur-sm">
            <svg
              className="h-6 w-6"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M7 7.5C7 6.12 8.12 5 9.5 5H16M7 7.5C7 8.88 8.12 10 9.5 10H14.5C15.88 10 17 11.12 17 12.5C17 13.88 15.88 15 14.5 15H9.5C8.12 15 7 16.12 7 17.5C7 18.88 8.12 20 9.5 20H16"
                stroke="url(#snitchLogo)"
                strokeWidth="2.2"
                strokeLinecap="round"
              />

              <defs>
                <linearGradient
                  id="snitchLogo"
                  x1="7"
                  y1="5"
                  x2="17"
                  y2="20"
                >
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="50%" stopColor="#818cf8" />
                  <stop offset="100%" stopColor="#c084fc" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          <span className="text-2xl font-extrabold tracking-tight text-white">
            SNITCH
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 my-10 max-w-xl space-y-8">
        
        {/* Heading */}
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-200">
            {resolvedEyebrow}
          </p>

          <h1 className="max-w-lg text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[52px]">
            {resolvedHeadline}
          </h1>

          <p className="max-w-lg text-base leading-7 text-indigo-100/75 sm:text-lg">
            {resolvedSubheading}
          </p>
        </div>

        {/* Feature Cards */}
        <div className="hidden sm:block space-y-3">
          {resolvedCards.map((card) => (
            <div
              key={card.id}
              className="group flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.06] p-4 backdrop-blur-md transition-all duration-300 hover:border-white/20 hover:bg-white/[0.09]"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08] shadow-inner transition-transform duration-300 group-hover:scale-105">
                {card.icon}
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-semibold tracking-tight text-white sm:text-[15px]">
                  {card.title}
                </h3>

                <p className="mt-1 text-xs leading-relaxed text-indigo-100/60 sm:text-[13px]">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-5 text-xs text-indigo-100/60">
        <span className="font-medium">
          © 2025 SNITCH Inc.
        </span>

        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />

          <span className="font-medium">
            {footerPhrase}
          </span>
        </div>
      </div>
    </div>
  );
};

export default BrandPanel;