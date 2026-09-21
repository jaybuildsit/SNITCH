const defaultRegisterFeatureCards = [
  {
    id: 1,
    title: "Discover what you love",
    description:
      "Explore products from brands and sellers worth knowing.",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
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
    description:
      "A simple and seamless experience from discovery to checkout.",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
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
    description:
      "Bring your products to more customers with SNITCH.",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
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
    description:
      "Explore products from brands and sellers worth knowing.",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
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
    description:
      "A simple and seamless experience from discovery to checkout.",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
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
    description:
      "Shop your favorites or grow your business with SNITCH.",
    icon: (
      <svg
        className="h-4 w-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth="1.5"
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
    eyebrow ||
    (isLogin
      ? "WELCOME BACK TO SNITCH"
      : "WELCOME TO SNITCH");

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
    cards ||
    (isLogin ? loginFeatureCards : defaultRegisterFeatureCards);

  return (
    <div className="relative flex min-h-full w-full flex-col justify-between overflow-hidden bg-[#f7f7f5] px-8 py-8 text-[#111111] sm:px-12 sm:py-10 lg:px-16 lg:py-12">

      {/* --------------------------------
          Brand
      -------------------------------- */}

      <div className="relative z-10">

        <div className="flex items-center gap-4">

          <span className="text-[20px] font-semibold tracking-[0.22em] text-[#111111]">
            SNITCH
          </span>

          <span className="h-1 w-1 rounded-full bg-black/20" />

          <span className="text-[11px] tracking-wide text-black/40">
            Seller Studio
          </span>

        </div>

      </div>


      {/* --------------------------------
          Main Content
      -------------------------------- */}

      <div className="relative z-10 my-12 max-w-[520px]">

        {/* Eyebrow */}

        <p className="mb-5 text-[10px] font-medium tracking-[0.2em] text-black/40">
          {resolvedEyebrow}
        </p>


        {/* Headline */}

        <h1 className="max-w-[500px] text-[42px] font-medium leading-[1.02] tracking-[-0.045em] text-[#111111] sm:text-[50px] lg:text-[56px]">
          {resolvedHeadline}
        </h1>


        {/* Subheading */}

        <p className="mt-6 max-w-[440px] text-[14px] leading-6 text-black/50 sm:text-[15px]">
          {resolvedSubheading}
        </p>


        {/* --------------------------------
            Feature List
        -------------------------------- */}

        <div className="mt-10 hidden border-t border-black/[0.08] sm:block">

          {resolvedCards.map((card, index) => (
            <div
              key={card.id}
              className={`
                group
                flex
                items-center
                gap-4
                border-b
                border-black/[0.08]
                py-5
                transition-colors
                duration-200
                hover:bg-black/[0.015]
                ${index === 0 ? "" : ""}
              `}
            >

              {/* Icon */}

              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-black/[0.1] bg-white text-black/60 transition-colors duration-200 group-hover:border-black/20 group-hover:text-black">
                {card.icon}
              </div>


              {/* Content */}

              <div className="min-w-0">

                <h3 className="text-[12px] font-medium tracking-wide text-black/80">
                  {card.title}
                </h3>

                <p className="mt-1 text-[11px] leading-5 text-black/40">
                  {card.description}
                </p>

              </div>

            </div>
          ))}

        </div>

      </div>


      {/* --------------------------------
          Footer
      -------------------------------- */}

      <div className="relative z-10 flex items-center justify-between border-t border-black/[0.08] pt-5 text-[10px] text-black/35">

        <span>
          © 2025 SNITCH Inc.
        </span>

        <span className="tracking-wide">
          {footerPhrase}
        </span>

      </div>

    </div>
  );
};

export default BrandPanel;