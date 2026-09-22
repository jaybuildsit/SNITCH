const DEFAULT_MODEL_IMAGE =
  "https://images.unsplash.com/photo-1627225924765-552d49cf47ad?auto=format&fit=crop&w=1600&q=90";

export const BrandPanel = ({
  variant = "register",
  eyebrow,
  headline,
  subheading,
  footerPhrase = "Shop. Sell. Discover.",
  modelImage = DEFAULT_MODEL_IMAGE,
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
        Dress
        <br />
        different.
      </>
    ) : (
      <>
        Discover
        <br />
        what's next.
      </>
    ));

  const resolvedSubheading =
    subheading ||
    (isLogin
      ? "Discover fashion from brands and sellers worth knowing."
      : "Find pieces that speak to your style. Shop, sell, and discover on SNITCH.");

  return (
    <div className="relative flex min-h-full w-full flex-col overflow-hidden bg-[#f7f7f5] text-[#111111]">

      {/* =====================================================
          FASHION IMAGE
      ===================================================== */}

      <div className="pointer-events-none absolute inset-0">

        <img
          src={modelImage}
          alt=""
          className="
            absolute
            right-0
            top-0
            h-full
            w-[58%]
            object-cover
            object-center
            grayscale-[10%]
            contrast-[1.02]
          "
        />

        {/* Main left fade */}
        <div
          className="
            absolute
            inset-0
            bg-gradient-to-r
            from-[#f7f7f5]
            via-[#f7f7f5]/95
            via-[28%]
            via-[#f7f7f5]/45
            via-[52%]
            to-transparent
          "
        />

        {/* Bottom fade */}
        <div
          className="
            absolute
            inset-x-0
            bottom-0
            h-[32%]
            bg-gradient-to-t
            from-[#f7f7f5]
            via-[#f7f7f5]/70
            to-transparent
          "
        />

        {/* Slight overall wash */}
        <div className="absolute inset-0 bg-white/[0.04]" />

      </div>


      {/* =====================================================
          CONTENT
      ===================================================== */}

      <div
        className="
          relative
          z-10
          flex
          min-h-full
          flex-1
          flex-col
          justify-between
          px-8
          py-8
          sm:px-12
          sm:py-10
          lg:px-16
          lg:py-12
        "
      >

        {/* ===================================================
            BRAND
        =================================================== */}

        <div>

          <div className="flex items-center gap-4">

            <span
              className="
                text-[20px]
                font-semibold
                tracking-[0.22em]
                text-[#111111]
              "
            >
              SNITCH
            </span>

            <span className="h-1 w-1 rounded-full bg-black/20" />

            <span
              className="
                text-[11px]
                tracking-wide
                text-black/40
              "
            >
                
            </span>

          </div>

        </div>


        {/* ===================================================
            EDITORIAL CONTENT
        =================================================== */}

        <div
          className="
            my-auto
            max-w-[500px]
            py-16
            sm:py-20
          "
        >

          {/* Eyebrow */}

          <p
            className="
              mb-5
              text-[10px]
              font-medium
              tracking-[0.22em]
              text-black/40
            "
          >
            {resolvedEyebrow}
          </p>


          {/* Headline */}

          <h1
            className="
              max-w-[520px]
              text-[48px]
              font-medium
              leading-[0.95]
              tracking-[-0.055em]
              text-[#111111]
              sm:text-[60px]
              lg:text-[68px]
              xl:text-[74px]
            "
          >
            {resolvedHeadline}
          </h1>


          {/* Subheading */}

          <p
            className="
              mt-7
              max-w-[390px]
              text-[14px]
              leading-6
              text-black/50
              sm:text-[15px]
            "
          >
            {resolvedSubheading}
          </p>


          {/* Editorial detail */}

          <div className="mt-10 flex items-center gap-3">

            <span className="h-px w-12 bg-black/15" />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.18em]
                text-black/30
              "
            >
              SNITCH
            </span>

          </div>

        </div>


        {/* ===================================================
            FOOTER
        =================================================== */}

        <div
          className="
            flex
            items-center
            justify-between
            border-t
            border-black/[0.08]
            pt-5
            text-[10px]
            text-black/35
          "
        >

          <span>
            © 2025 SNITCH Inc.
          </span>

          <span className="tracking-wide">
            {footerPhrase}
          </span>

        </div>

      </div>

    </div>
  );
};

export default BrandPanel;