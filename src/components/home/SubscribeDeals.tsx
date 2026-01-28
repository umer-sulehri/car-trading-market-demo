"use client";

import { FC } from "react";

const SubscribeDeals: FC = () => {
  return (
    <section className="relative py-24 bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden">
      {/* Soft background glow */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse-slow delay-2000" />

      <div className="relative max-w-4xl mx-auto px-6 text-center bg-white/50 backdrop-blur-lg rounded-3xl p-12 shadow-lg">
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-blue-900">
          Never Miss a Deal!
        </h2>

        {/* Subheading */}
        <p className="mt-4 text-blue-800 text-lg">
          Subscribe to get the latest offers, new arrivals, and exclusive discounts.
        </p>

        {/* Input + Button */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <input
            type="email"
            placeholder="Enter your email address"
            className="w-full sm:w-96 px-5 py-3 rounded-full border border-blue-300
                       focus:outline-none focus:ring-2 focus:ring-blue-400
                       text-blue-900 placeholder:text-blue-400 text-sm transition-all"
          />

          <button
            className="px-8 py-3 rounded-full bg-blue-600 text-white text-sm font-medium
                       hover:bg-blue-500 hover:shadow-lg transition-all duration-300 active:scale-95"
          >
            Subscribe
          </button>
        </div>
      </div>
    </section>
  );
};

export default SubscribeDeals;
