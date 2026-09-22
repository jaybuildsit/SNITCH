import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85";

const Home = () => {
  const navigate = useNavigate();

  const products = useSelector(
    (state) => state.product.Products
  ) || [];

  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  const getImage = (product, index = 0) => {
    return product?.images?.[index]?.url || FALLBACK_IMAGE;
  };

  const formatPrice = (product) => {
    const amount = product?.price?.amount;

    if (!amount) return "₹ —";

    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: product?.price?.currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const openProduct = (product) => {
    navigate(`/products/${product._id}`);
  };

  const featured = products.slice(0, 3);
  const newProducts = products.slice(0, 4);
  const collectionProducts = products.slice(0, 6);

  return (
    <main className="min-h-screen bg-[#f5f5f2] text-[#111111]">

      {/* =====================================================
          HEADER
      ===================================================== */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f5f5f2]/95 backdrop-blur-sm">
        <div className="mx-auto flex h-[64px] max-w-[1440px] items-center justify-between px-6 md:px-10">

          {/* Left */}
          <div className="flex items-center gap-8">

            <button
              className="group flex h-9 w-9 items-center justify-center"
              aria-label="Menu"
            >
              <div className="flex w-[18px] flex-col gap-[5px]">
                <span className="h-[1px] w-full bg-black transition-all duration-300 group-hover:w-[12px]" />
                <span className="h-[1px] w-[12px] bg-black transition-all duration-300 group-hover:w-full" />
              </div>
            </button>

            <nav className="hidden items-center gap-7 text-[10px] font-medium uppercase tracking-[0.18em] md:flex">
              <button className="transition-opacity hover:opacity-50">
                Home
              </button>

              <button className="transition-opacity hover:opacity-50">
                Collections
              </button>

              <button className="transition-opacity hover:opacity-50">
                New
              </button>
            </nav>
          </div>

          {/* Logo */}
          <button
            onClick={() => navigate("/")}
            className="absolute left-1/2 -translate-x-1/2 text-[22px] font-black tracking-[-0.08em]"
          >
            SNITCH
          </button>

          {/* Right */}
          <div className="flex items-center gap-3">

            <button
              className="hidden h-9 w-9 items-center justify-center rounded-full bg-[#151515] text-white sm:flex"
              aria-label="Account"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21c.8-4 3.2-6 7-6s6.2 2 7 6" />
              </svg>
            </button>

            <button
              className="flex h-9 items-center gap-2 rounded-full bg-[#151515] px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-white transition-transform hover:scale-[1.03]"
              onClick={() => navigate("/cart")}
            >
              Cart
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[8px] text-black">
                0
              </span>
            </button>
          </div>
        </div>
      </header>


      {/* =====================================================
          CATEGORY / SEARCH
      ===================================================== */}
      <section className="mx-auto flex max-w-[1440px] items-start justify-between px-6 pt-8 md:px-10">

        <div className="flex flex-col gap-1 text-[10px] uppercase tracking-[0.16em]">
          <button className="text-left font-semibold">Men</button>
          <button className="text-left text-black/45 hover:text-black">Women</button>
          <button className="text-left text-black/45 hover:text-black">Kids</button>
        </div>

        <button className="hidden w-[230px] items-center justify-between border-b border-black/20 pb-2 text-[9px] uppercase tracking-[0.18em] text-black/50 sm:flex">
          <span className="flex items-center gap-3">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <circle cx="11" cy="11" r="6" />
              <path d="m16 16 5 5" />
            </svg>
            Search
          </span>

          <span>⌕</span>
        </button>
      </section>


      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="mx-auto max-w-[1440px] px-6 pb-28 pt-16 md:px-10 md:pt-20">

        <div className="grid min-h-[580px] grid-cols-1 gap-4 md:grid-cols-[0.8fr_1.45fr_0.8fr]">

          {/* Hero copy */}
          <div className="flex flex-col justify-between py-3">

            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.25em] text-black/45">
                SNITCH / 2026
              </p>

              <h1 className="max-w-[420px] text-[58px] font-black uppercase leading-[0.82] tracking-[-0.075em] sm:text-[72px] md:text-[78px] lg:text-[92px]">
                New
                <br />
                Collection
              </h1>

              <p className="mt-6 max-w-[230px] text-[11px] leading-5 text-black/55">
                Pieces designed for the way you move.
                <br />
                Discover the latest from SNITCH.
              </p>
            </div>

            <button
              onClick={() => {
                document
                  .getElementById("new-this-week")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="group flex w-[180px] items-center justify-between border border-black px-4 py-3 text-[9px] uppercase tracking-[0.18em] transition-all duration-300 hover:bg-black hover:text-white"
            >
              Shop collection

              <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                →
              </span>
            </button>
          </div>


          {/* Main hero image */}
          <div
            className="group relative min-h-[420px] cursor-pointer overflow-hidden bg-[#e9e9e5] md:min-h-0"
            onClick={() => featured[0] && openProduct(featured[0])}
          >
            <img
              src={"https://images.unsplash.com/photo-1541519481457-763224276691?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
                
              alt={featured[0]?.title || "SNITCH collection"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />

            <div className="absolute left-5 top-5">
              <span className="bg-white/90 px-3 py-2 text-[8px] uppercase tracking-[0.2em]">
                Featured
              </span>
            </div>

            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between text-white">
              <div>
                <p className="text-[8px] uppercase tracking-[0.2em] opacity-70">
                  Latest drop
                </p>
                <p className="mt-1 text-sm uppercase tracking-[0.04em]">
                  {featured[0]?.title || "New Season"}
                </p>
              </div>

              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black">
                ↗
              </span>
            </div>
          </div>


          {/* Secondary hero */}
          <div
            className="group relative min-h-[420px] cursor-pointer overflow-hidden bg-[#e8e8e5] md:min-h-0"
            onClick={() => featured[1] && openProduct(featured[1])}
          >
            <img
              src={"https://images.unsplash.com/photo-1704208316515-a32f81e373ef?q=80&w=928&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt={featured[1]?.title || "SNITCH fashion"}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
            />

            <div className="absolute bottom-5 left-5">
              <p className="text-[8px] uppercase tracking-[0.2em] text-white/70">
                SNITCH
              </p>

              <p className="mt-1 max-w-[180px] text-sm uppercase text-white">
                {featured[1]?.title || "Everyday essentials"}
              </p>
            </div>
          </div>
        </div>
      </section>


      {/* =====================================================
          NEW THIS WEEK
      ===================================================== */}
      <section
        id="new-this-week"
        className="border-t border-black/10 py-24"
      >
        <div className="mx-auto max-w-[1440px] px-6 md:px-10">

          <div className="mb-12 flex items-end justify-between">

            <div>
              <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-black/40">
                Just dropped
              </p>

              <h2 className="text-[48px] font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-[64px]">
                New
                <br />
                This Week
                <sup className="ml-2 align-top text-[11px] font-medium tracking-normal">
                  ({products.length})
                </sup>
              </h2>
            </div>

            <button className="hidden text-[9px] uppercase tracking-[0.18em] underline underline-offset-4 sm:block">
              See all
            </button>
          </div>


          {/* Product grid */}
          {newProducts.length > 0 ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-12 sm:grid-cols-3 lg:grid-cols-4">

              {newProducts.map((product) => (
                <article
                  key={product._id}
                  onClick={() => openProduct(product)}
                  className="group cursor-pointer"
                >

                  <div className="relative aspect-[0.82] overflow-hidden bg-[#e9e9e7]">

                    <img
                      src={getImage(product)}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.035]"
                    />

                    {/* Plus */}
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="absolute bottom-3 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full bg-white text-lg font-light opacity-0 shadow-sm transition-all duration-300 group-hover:opacity-100"
                    >
                      +
                    </button>

                    <span className="absolute left-3 top-3 text-[8px] uppercase tracking-[0.18em] text-black/50">
                      New
                    </span>
                  </div>


                  <div className="mt-3 flex items-start justify-between gap-3">

                    <div className="min-w-0">
                      <p className="mb-1 truncate text-[8px] uppercase tracking-[0.15em] text-black/40">
                        SNITCH
                      </p>

                      <h3 className="truncate text-[11px] font-medium uppercase tracking-[0.02em]">
                        {product.title}
                      </h3>
                    </div>

                    <p className="shrink-0 text-[10px] font-medium">
                      {formatPrice(product)}
                    </p>
                  </div>

                </article>
              ))}

            </div>
          ) : (
            <div className="flex min-h-[300px] items-center justify-center border border-black/10">
              <p className="text-[10px] uppercase tracking-[0.2em] text-black/40">
                No products available
              </p>
            </div>
          )}
        </div>
      </section>


      {/* =====================================================
          COLLECTIONS
      ===================================================== */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-10">

        <div className="mb-12 flex flex-col justify-between gap-8 lg:flex-row lg:items-end">

          <div>
            <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-black/40">
              Explore
            </p>

            <h2 className="text-[48px] font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-[64px]">
              SNITCH
              <br />
              Collections
              <br />
              <span className="text-black/20">26—27</span>
            </h2>
          </div>

          <div className="flex gap-8 text-[9px] uppercase tracking-[0.16em]">
            <button className="font-semibold underline underline-offset-4">
              All
            </button>
            <button className="text-black/40">Men</button>
            <button className="text-black/40">Women</button>
            <button className="text-black/40">New</button>
          </div>
        </div>


        {collectionProducts.length > 0 && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">

            {collectionProducts.slice(0, 3).map((product, index) => (
              <article
                key={product._id}
                onClick={() => openProduct(product)}
                className={`group cursor-pointer ${
                  index === 1 ? "md:mt-14" : ""
                }`}
              >

                <div className="aspect-[0.82] overflow-hidden bg-[#e8e8e5]">
                  <img
                    src={getImage(product)}
                    alt={product.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.025]"
                  />
                </div>

                <div className="mt-4 flex items-start justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-[0.15em] text-black/40">
                      Collection / 01
                    </p>

                    <h3 className="mt-1 text-[11px] uppercase">
                      {product.title}
                    </h3>
                  </div>

                  <span className="text-[10px]">
                    {formatPrice(product)}
                  </span>
                </div>

              </article>
            ))}

          </div>
        )}

        <div className="mt-10 flex justify-center">
          <button className="border-b border-black pb-1 text-[9px] uppercase tracking-[0.2em]">
            Load more
          </button>
        </div>
      </section>


      {/* =====================================================
          EDITORIAL STATEMENT
      ===================================================== */}
      <section className="border-y border-black/10 py-28">

        <div className="mx-auto max-w-[900px] px-6 text-center">

          <p className="mb-7 text-[9px] uppercase tracking-[0.25em] text-black/40">
            The SNITCH approach
          </p>

          <h2 className="text-[28px] font-medium uppercase leading-[1.05] tracking-[-0.045em] sm:text-[42px] md:text-[52px]">
            Designed to make
            <br />
            everyday dressing
            <br />
            feel different.
          </h2>

          <p className="mx-auto mt-8 max-w-[560px] text-[11px] leading-6 text-black/50">
            We believe good clothing doesn't need to shout.
            Thoughtful silhouettes, considered details and pieces
            built to move with you — that's the SNITCH way.
          </p>

        </div>
      </section>


      {/* =====================================================
          EDITORIAL IMAGE STRIP
      ===================================================== */}
      <section className="overflow-hidden py-28">

        <div className="mx-auto flex max-w-[1440px] items-start gap-4 px-6 md:px-10">

          <div className="w-[31%] shrink-0 pt-12">
            <div className="aspect-[0.78] overflow-hidden bg-[#e8e8e5]">
              <img
                src={
                  collectionProducts[0]
                    ? getImage(collectionProducts[0])
                    : FALLBACK_IMAGE
                }
                alt="SNITCH editorial"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="w-[26%] shrink-0">
            <div className="aspect-[0.72] overflow-hidden bg-[#e8e8e5]">
              <img
                src={
                  collectionProducts[1]
                    ? getImage(collectionProducts[1])
                    : FALLBACK_IMAGE
                }
                alt="SNITCH editorial"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="w-[31%] shrink-0 pt-24">
            <div className="aspect-[0.78] overflow-hidden bg-[#e8e8e5]">
              <img
                src={
                  collectionProducts[2]
                    ? getImage(collectionProducts[2])
                    : FALLBACK_IMAGE
                }
                alt="SNITCH editorial"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="w-[20%] shrink-0 pt-8">
            <div className="aspect-[0.65] overflow-hidden bg-[#e8e8e5]">
              <img
                src={
                  collectionProducts[3]
                    ? getImage(collectionProducts[3])
                    : FALLBACK_IMAGE
                }
                alt="SNITCH editorial"
                className="h-full w-full object-cover"
              />
            </div>
          </div>

        </div>
      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="border-t border-black/10 bg-[#eeeeeb]">

        <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-10">

          <div className="grid grid-cols-2 gap-12 md:grid-cols-4">

            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.2em] text-black/40">
                SNITCH
              </p>

              <p className="max-w-[180px] text-[11px] leading-5 text-black/55">
                Shop. Discover. Dress different.
              </p>
            </div>

            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.2em]">
                Explore
              </p>

              <div className="flex flex-col gap-2 text-[10px] text-black/50">
                <button className="text-left hover:text-black">Men</button>
                <button className="text-left hover:text-black">Women</button>
                <button className="text-left hover:text-black">New arrivals</button>
                <button className="text-left hover:text-black">Collections</button>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.2em]">
                Help
              </p>

              <div className="flex flex-col gap-2 text-[10px] text-black/50">
                <button className="text-left hover:text-black">Contact</button>
                <button className="text-left hover:text-black">Shipping</button>
                <button className="text-left hover:text-black">Returns</button>
                <button className="text-left hover:text-black">FAQ</button>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[9px] uppercase tracking-[0.2em]">
                Follow
              </p>

              <div className="flex flex-col gap-2 text-[10px] text-black/50">
                <button className="text-left hover:text-black">Instagram</button>
                <button className="text-left hover:text-black">X</button>
                <button className="text-left hover:text-black">Pinterest</button>
              </div>
            </div>

          </div>


          <div className="mt-20 flex flex-col justify-between gap-5 border-t border-black/10 pt-6 text-[8px] uppercase tracking-[0.16em] text-black/40 sm:flex-row">
            <span>© 2026 SNITCH</span>
            <span>Privacy / Terms</span>
          </div>

        </div>
      </footer>

    </main>
  );
};

export default Home;