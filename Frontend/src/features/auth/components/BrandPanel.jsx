import React from 'react';

export const BrandPanel = () => {
  const featureCards = [
    {
      id: 1,
      title: 'Discover better insights',
      description: 'Real-time analytical telemetry & smart predictions',
      icon: (
        <svg
          className="w-5 h-5 text-indigo-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"
          />
        </svg>
      ),
    },
    {
      id: 2,
      title: 'Manage everything effortlessly',
      description: 'Unified command center tailored for teams',
      icon: (
        <svg
          className="w-5 h-5 text-indigo-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z"
          />
        </svg>
      ),
    },
    {
      id: 3,
      title: 'Build and grow with SNITCH',
      description: 'Enterprise-grade security and compliant scalability',
      icon: (
        <svg
          className="w-5 h-5 text-indigo-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
          />
        </svg>
      ),
    },
  ];

  return (
    <div className="relative w-full h-full min-h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden bg-gradient-to-br from-[#121c4e] via-[#1c1a5b] to-[#301267]">
      {/* Ambient background lighting & glowing decorative elements */}
      <div
        className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-blue-500/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full bg-violet-500/20 blur-3xl pointer-events-none"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-32 left-1/4 w-[420px] h-[420px] rounded-full bg-indigo-600/25 blur-3xl pointer-events-none"
        aria-hidden="true"
      />

      {/* Subtle abstract curved lighting arc */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20"
        viewBox="0 0 800 1000"
        fill="none"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-100 150 C 250 180, 550 50, 900 350 C 600 700, 200 650, -50 950"
          stroke="url(#ambient-curve)"
          strokeWidth="2"
          strokeDasharray="8 8"
        />
        <defs>
          <linearGradient id="ambient-curve" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>

      {/* Top Header Section */}
      <div className="relative z-10 space-y-6">
        {/* Top Brand Logo & Version */}
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-600 to-purple-600 p-0.5 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
            <div className="w-full h-full bg-[#161942]/70 rounded-[10px] backdrop-blur-xs flex items-center justify-center">
              {/* SNITCH Signature Stylized Geometric S Logo */}
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                <path
                  d="M6 8.5C6 6.567 7.567 5 9.5 5H16C17.1046 5 18 5.89543 18 7C18 8.10457 17.1046 9 16 9H8C6.89543 9 6 9.89543 6 11V11C6 12.1046 6.89543 13 8 13H15C16.6569 13 18 14.3431 18 16V16C18 18.2091 16.2091 20 14 20H8C6.89543 20 6 19.1046 6 18"
                  stroke="url(#logo-grad)"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="logo-grad" x1="6" y1="5" x2="18" y2="20">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#c084fc" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="text-2xl font-black tracking-wider text-white">
              SNITCH
            </span>
            <span className="px-2 py-0.5 text-[11px] font-bold tracking-wide rounded-md bg-white/10 text-indigo-200 border border-white/15 backdrop-blur-sm">
              V2.4
            </span>
          </div>
        </div>

        {/* Upper Translucent Badge */}
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 backdrop-blur-md shadow-sm transition-colors duration-200">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
            </span>
            <span className="text-xs font-semibold text-indigo-100 tracking-wide">
              Intelligent SaaS Platform
            </span>
          </div>
        </div>
      </div>

      {/* Main Left Content & Features */}
      <div className="relative z-10 my-6 lg:my-10 space-y-6 sm:space-y-8 max-w-xl">
        {/* Headings */}
        <div className="space-y-2.5 sm:space-y-3">
          <p className="text-[11px] sm:text-xs font-bold tracking-widest text-indigo-300 uppercase">
            WELCOME TO SNITCH
          </p>
          <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-extrabold text-white tracking-tight leading-[1.12]">
            Everything you need,
            <br />
            all in one place.
          </h1>
          <p className="text-sm sm:text-base text-indigo-200/80 leading-relaxed max-w-md pt-0.5 sm:pt-1">
            Create your account and get started with a smarter, simpler, and
            seamlessly integrated experience.
          </p>
        </div>

        {/* Feature Cards - visible on tablet and desktop for clean mobile ergonomics */}
        <div className="space-y-3 hidden sm:block">
          {featureCards.map((card) => (
            <div
              key={card.id}
              className="group flex items-start gap-3.5 p-3.5 sm:p-4 rounded-2xl bg-white/[0.06] hover:bg-white/[0.10] border border-white/10 hover:border-white/20 backdrop-blur-md transition-all duration-200 shadow-sm"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-white/15 to-white/5 border border-white/15 flex items-center justify-center shrink-0 shadow-inner group-hover:scale-105 transition-transform duration-200">
                {card.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-[15px] font-semibold text-white tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-[13px] text-indigo-200/75 mt-0.5 leading-snug">
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Left Footer */}
      <div className="relative z-10 pt-4 sm:pt-6 border-t border-white/10 flex items-center justify-between text-xs text-indigo-200/70">
        <span className="font-medium tracking-wide">© 2025 SNITCH Inc.</span>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] inline-block" />
          <span className="font-medium tracking-wide">99.99% Guaranteed Uptime</span>
        </div>
      </div>
    </div>
  );
};

export default BrandPanel;
