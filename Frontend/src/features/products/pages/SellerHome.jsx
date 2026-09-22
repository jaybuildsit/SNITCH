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
        {/* Actions */}
        <div className="mt-16 grid max-w-4xl gap-4 sm:grid-cols-2">
          {/* Create Product */}
          <button
            type="button"
            onClick={() => navigate("/seller/create")}
            className="
      group
      relative
      flex
      min-h-[250px]
      flex-col
      justify-between
      overflow-hidden
      rounded-[4px]
      border
      border-black/[0.10]
      bg-white
      p-7
      text-left
      transition-all
      duration-500
      hover:border-[#111111]
      hover:bg-[#111111]
    "
          >
            <div className="flex items-start justify-between">
              <span
                className="
          text-[10px]
          font-medium
          tracking-[0.2em]
          text-black/35
          transition-colors
          duration-500
          group-hover:text-white/40
        "
              >
                01
              </span>

              <span
                className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-black/10
          text-[16px]
          text-black/60
          transition-all
          duration-500
          group-hover:border-white/20
          group-hover:text-white
        "
              >
                ↗
              </span>
            </div>

            <div>
              <p
                className="
          text-[24px]
          font-medium
          tracking-[-0.03em]
          text-[#111111]
          transition-colors
          duration-500
          group-hover:text-white
        "
              >
                Create product
              </p>

              <p
                className="
          mt-3
          max-w-[240px]
          text-[12px]
          leading-5
          text-black/40
          transition-colors
          duration-500
          group-hover:text-white/45
        "
              >
                Add something new to your store and make it available to customers.
              </p>
            </div>
          </button>

          {/* View Products */}
          <button
            type="button"
            onClick={() => navigate("/seller/dashboard")}
            className="
      group
      relative
      flex
      min-h-[250px]
      flex-col
      justify-between
      overflow-hidden
      rounded-[4px]
      border
      border-black/[0.10]
      bg-white
      p-7
      text-left
      transition-all
      duration-500
      hover:border-[#111111]
      hover:bg-[#111111]
    "
          >
            <div className="flex items-start justify-between">
              <span
                className="
          text-[10px]
          font-medium
          tracking-[0.2em]
          text-black/35
          transition-colors
          duration-500
          group-hover:text-white/40
        "
              >
                02
              </span>

              <span
                className="
          flex
          h-9
          w-9
          items-center
          justify-center
          rounded-full
          border
          border-black/10
          text-[16px]
          text-black/60
          transition-all
          duration-500
          group-hover:border-white/20
          group-hover:text-white
        "
              >
                ↗
              </span>
            </div>

            <div>
              <p
                className="
          text-[24px]
          font-medium
          tracking-[-0.03em]
          text-[#111111]
          transition-colors
          duration-500
          group-hover:text-white
        "
              >
                Your products
              </p>

              <p
                className="
          mt-3
          max-w-[240px]
          text-[12px]
          leading-5
          text-black/40
          transition-colors
          duration-500
          group-hover:text-white/45
        "
              >
                View, manage, and edit everything you've created for your store.
              </p>
            </div>
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