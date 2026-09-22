import React from "react";
import { useNavigate } from "react-router";

const SellerHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f7f7f5] text-[#111111]">
      {/* Header */}
      <header className="flex h-[52px] items-center justify-between border-b border-black/[0.08] px-6 sm:px-10">
        <div className="flex items-center gap-3">
          <span className="text-[15px] font-semibold tracking-[0.18em]">
            SNITCH
          </span>

          <span className="h-1 w-1 rounded-full bg-black/20" />

          <span className="text-[10px] tracking-wide text-black/40">
            Seller Studio
          </span>
        </div>

        <span className="text-[10px] uppercase tracking-[0.16em] text-black/35">
          Seller
        </span>
      </header>

      {/* Main */}
      <main className="mx-auto flex min-h-[calc(100vh-52px)] max-w-5xl flex-col justify-center px-6 py-16 sm:px-10">
        <div className="max-w-2xl">
          <p className="mb-5 text-[10px] font-medium tracking-[0.22em] text-black/40">
            SELLER STUDIO
          </p>

          <h1 className="text-[46px] font-medium leading-[0.95] tracking-[-0.055em] sm:text-[64px]">
            Manage your
            <br />
            store.
          </h1>

          <p className="mt-6 max-w-md text-[14px] leading-6 text-black/45">
            Create something new or manage the products you've already made.
          </p>
        </div>

        {/* Actions */}
        <div className="mt-16 max-w-3xl border-t border-black/[0.08]">
          <button
            type="button"
            onClick={() => navigate("/seller/create")}
            className="group flex w-full items-center justify-between border-b border-black/[0.08] py-8 text-left transition-opacity duration-200 hover:opacity-60"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
                Create product
              </p>

              <p className="mt-2 text-[13px] text-black/40">
                Add a new product to your store.
              </p>
            </div>

            <span className="text-[22px] transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="group flex w-full items-center justify-between py-8 text-left transition-opacity duration-200 hover:opacity-60"
          >
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em]">
                Your products
              </p>

              <p className="mt-2 text-[13px] text-black/40">
                View and manage your products.
              </p>
            </div>

            <span className="text-[22px] transition-transform duration-200 group-hover:translate-x-1">
              →
            </span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-auto flex items-center justify-between border-t border-black/[0.08] pt-5 text-[10px] text-black/30">
          <span>SNITCH</span>
          <span>Shop. Sell. Discover.</span>
        </div>
      </main>
    </div>
  );
};

export default SellerHome;