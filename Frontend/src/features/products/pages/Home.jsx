import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { useProduct } from "../hooks/useProduct";
import { useCart } from "../../cart/hooks/UseCart";

const FALLBACK_IMAGE =
  "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=85";

const Home = () => {
  const navigate = useNavigate();

  const { handleGetCart } = useCart();

  const [cartCount, setCartCount] = useState(0);

  const products =
    useSelector((state) => state.product.Products) || [];

  const user = useSelector((state) => state.auth.user);

  const { handleGetAllProducts } = useProduct();

  useEffect(() => {
    handleGetAllProducts();
  }, []);

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const cart = await handleGetCart();

        const count =
          cart?.items?.reduce(
            (total, item) => total + (item.quantity || 0),
            0
          ) || 0;

        setCartCount(count);
      } catch (error) {
        console.error("GET CART COUNT ERROR:", error);
      }
    };

    fetchCartCount();
  }, []);

  const getImage = (product) => {
    return product?.images?.[0]?.url || FALLBACK_IMAGE;
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

  const getUserName = () => {
    if (!user) return "Guest";

    return (
      user.fullName ||
      user.name ||
      user.email?.split("@")[0] ||
      "User"
    );
  };

  return (
    <main className="min-h-screen bg-[#f8f8f6] text-[#111]">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="border-b border-black/10 bg-[#f8f8f6]">

        <div className="mx-auto flex h-[68px] max-w-[1400px] items-center justify-between px-6 md:px-10">

          {/* LEFT */}
          <div className="flex items-center gap-10">

            {/* Menu */}
            <button
              aria-label="Menu"
              className="group flex h-8 w-8 flex-col items-center justify-center gap-[5px]"
            >
              <span className="h-[1px] w-[17px] bg-black transition-all duration-300 group-hover:w-[11px]" />
              <span className="h-[1px] w-[11px] bg-black transition-all duration-300 group-hover:w-[17px]" />
            </button>

            {/* Navigation */}
            <nav className="hidden items-center gap-8 md:flex">

              <button className="text-[10px] font-medium uppercase tracking-[0.16em]">
                Men
              </button>

              <button className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/45 transition-colors hover:text-black">
                Women
              </button>

              <button className="text-[10px] font-medium uppercase tracking-[0.16em] text-black/45 transition-colors hover:text-black">
                New Arrivals
              </button>

            </nav>

          </div>


          {/* CENTER LOGO */}

          <button
            onClick={() => navigate("/")}
            className="absolute left-1/2 -translate-x-1/2 text-[22px] font-black tracking-[-0.08em]"
          >
            SNITCH
          </button>


          {/* RIGHT */}

          <div className="flex items-center gap-3">

            {/* Search */}

            <button
              aria-label="Search"
              className="hidden h-9 w-9 items-center justify-center rounded-full border border-black/10 transition-all hover:bg-black hover:text-white sm:flex"
            >
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <circle cx="11" cy="11" r="6" />
                <path d="m16 16 5 5" />
              </svg>
            </button>


            {/* LOGGED IN USER */}

            <div className="hidden items-center gap-2 border-l border-black/10 pl-4 sm:flex">

              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-[9px] font-medium uppercase text-white">
                {getUserName().charAt(0)}
              </div>

              <div className="hidden leading-none lg:block">

                <p className="mb-1 text-[8px] uppercase tracking-[0.16em] text-black/35">
                  Signed in as
                </p>

                <p className="max-w-[100px] truncate text-[10px] font-medium">
                  {getUserName()}
                </p>

              </div>

            </div>


            {/* CART */}


            <button
              onClick={() => navigate("/cart")}
              className="flex h-9 items-center gap-2 rounded-full bg-black px-4 text-[9px] font-medium uppercase tracking-[0.15em] text-white transition-transform hover:scale-[1.03]"
            >
              Cart

              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-[8px] text-black">
                {cartCount}
              </span>
            </button>

          </div>

        </div>

      </header>


      {/* =====================================================
          MOBILE USER BAR
      ===================================================== */}

      <div className="border-b border-black/10 px-6 py-3 sm:hidden">

        <div className="flex items-center justify-between">

          <div className="flex items-center gap-2">

            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-black text-[8px] uppercase text-white">
              {getUserName().charAt(0)}
            </div>

            <div>

              <p className="text-[7px] uppercase tracking-[0.16em] text-black/35">
                Signed in as
              </p>

              <p className="text-[9px] font-medium">
                {getUserName()}
              </p>

            </div>

          </div>

          <span className="text-[8px] uppercase tracking-[0.15em] text-black/35">
            SNITCH
          </span>

        </div>

      </div>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="mx-auto max-w-[1400px] px-6 pb-24 pt-20 md:px-10 md:pt-28">

        <div className="grid items-end gap-12 md:grid-cols-2">

          {/* TEXT */}

          <div>

            <p className="mb-6 text-[9px] font-medium uppercase tracking-[0.25em] text-black/40">
              SNITCH / NEW SEASON
            </p>

            <h1 className="max-w-[700px] text-[64px] font-black uppercase leading-[0.8] tracking-[-0.075em] sm:text-[85px] md:text-[100px] lg:text-[120px]">
              Discover
              <br />
              What&apos;s
              <br />
              Next.
            </h1>

          </div>


          {/* RIGHT INFO */}

          <div className="flex flex-col items-start justify-end md:items-end">

            <p className="max-w-[300px] text-left text-[11px] leading-5 text-black/50 md:text-right">
              A new selection of pieces built around
              clean silhouettes, everyday movement
              and a different way of dressing.
            </p>

            <button
              onClick={() =>
                document
                  .getElementById("all-products")
                  ?.scrollIntoView({
                    behavior: "smooth",
                  })
              }
              className="group mt-7 flex items-center gap-8 border-b border-black pb-2 text-[9px] font-medium uppercase tracking-[0.18em]"
            >
              Shop New Arrivals

              <span className="text-lg transition-transform duration-300 group-hover:translate-x-2">
                →
              </span>

            </button>

          </div>

        </div>


        {/* HERO IMAGE STRIP */}

        <div className="mt-16 aspect-[2.2/1] overflow-hidden bg-[#e9e9e6]">

          {products[0] ? (
            <img
              src={getImage(products[0])}
              alt={products[0]?.title || "SNITCH"}
              className="h-full w-full object-cover transition-transform duration-700 hover:scale-[1.015]"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <span className="text-[9px] uppercase tracking-[0.2em] text-black/30">
                SNITCH / NEW SEASON
              </span>
            </div>
          )}

        </div>

      </section>


      {/* =====================================================
          ALL PRODUCTS
      ===================================================== */}

      <section
        id="all-products"
        className="border-t border-black/10"
      >

        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">


          {/* SECTION HEADER */}

          <div className="mb-14 flex items-end justify-between">

            <div>

              <p className="mb-4 text-[9px] uppercase tracking-[0.25em] text-black/40">
                Explore the collection
              </p>

              <h2 className="text-[48px] font-black uppercase leading-[0.82] tracking-[-0.07em] sm:text-[68px]">
                All
                <br />
                Products
              </h2>

            </div>


            <p className="hidden text-[9px] uppercase tracking-[0.15em] text-black/40 sm:block">
              {products.length} Products
            </p>

          </div>


          {/* PRODUCT GRID */}

          {products.length > 0 ? (

            <div className="grid grid-cols-2 gap-x-3 gap-y-14 md:grid-cols-3 md:gap-x-5 md:gap-y-20">

              {products.map((product) => (

                <article
                  key={product._id}
                  onClick={() =>
                    navigate(`/products/${product._id}`)
                  }
                  className="group cursor-pointer"
                >

                  {/* IMAGE */}

                  <div className="relative aspect-[0.78] overflow-hidden bg-[#ececea]">

                    <img
                      src={getImage(product)}
                      alt={product.title}
                      className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.035]"
                    />


                    {/* NEW LABEL */}

                    <span className="absolute left-3 top-3 text-[8px] font-medium uppercase tracking-[0.18em] text-black/45">
                      New
                    </span>


                    {/* QUICK ADD */}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                      className="absolute bottom-4 left-1/2 flex h-10 w-10 -translate-x-1/2 translate-y-3 items-center justify-center rounded-full bg-white text-lg font-light opacity-0 shadow-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
                    >
                      +
                    </button>

                  </div>


                  {/* PRODUCT INFO */}

                  <div className="mt-4 flex items-start justify-between gap-4">

                    <div className="min-w-0">

                      <p className="mb-1 text-[8px] uppercase tracking-[0.18em] text-black/35">
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

            <div className="flex min-h-[350px] items-center justify-center border border-black/10">

              <div className="text-center">

                <p className="mb-3 text-[10px] uppercase tracking-[0.2em] text-black/40">
                  Nothing here yet
                </p>

                <p className="text-[11px] text-black/30">
                  New products are coming soon.
                </p>

              </div>

            </div>

          )}

        </div>

      </section>


      {/* =====================================================
          BOTTOM STATEMENT
      ===================================================== */}

      <section className="border-t border-black/10">

        <div className="mx-auto max-w-[1400px] px-6 py-28 md:px-10">

          <div className="max-w-[850px]">

            <p className="mb-7 text-[9px] uppercase tracking-[0.25em] text-black/35">
              SNITCH
            </p>

            <h2 className="text-[36px] font-medium uppercase leading-[0.95] tracking-[-0.05em] sm:text-[52px] md:text-[64px]">
              Dress different.
              <br />
              Move different.
              <br />
              Be different.
            </h2>

          </div>

        </div>

      </section>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="bg-[#111] text-white">

        <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14">

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

            {/* BRAND */}

            <div>

              <h2 className="text-3xl font-bold tracking-[0.3em]">
                SNITCH
              </h2>

              <p className="mt-5 text-sm text-gray-400 leading-6 max-w-xs">
                Redefining everyday style.
                Premium fashion for those who
                move different.
              </p>

            </div>

            {/* SHOP */}

            <div>

              <h3 className="font-medium mb-5">
                Shop
              </h3>

              <div className="space-y-3 text-sm text-gray-400">

                <p>Men</p>
                <p>Women</p>
                <p>New Arrivals</p>
                <p>Collections</p>
                <p>Sale</p>

              </div>

            </div>

            {/* HELP */}

            <div>

              <h3 className="font-medium mb-5">
                Help
              </h3>

              <div className="space-y-3 text-sm text-gray-400">

                <p>FAQ</p>
                <p>Shipping</p>
                <p>Returns & Exchange</p>
                <p>Size Guide</p>
                <p>Track Order</p>

              </div>

            </div>

            {/* COMPANY */}

            <div>

              <h3 className="font-medium mb-5">
                Company
              </h3>

              <div className="space-y-3 text-sm text-gray-400">

                <p>About Us</p>
                <p>Contact Us</p>
                <p>Terms of Service</p>
                <p>Privacy Policy</p>

              </div>

            </div>

          </div>

          <div className="border-t border-gray-800 mt-12 pt-6 flex flex-col sm:flex-row justify-between gap-4 text-xs text-gray-500">

            <p>
              © 2026 SNITCH. All Rights Reserved.
            </p>

            <p>
              India (INR ₹) · English
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
};

export default Home;