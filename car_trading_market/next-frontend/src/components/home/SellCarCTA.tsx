"use client";

import { FC } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { assets } from "@/src/assets/js/assets";

const SellCarCTA: FC = () => {
  const router = useRouter();

  return (
    <section className="relative py-24 bg-gray-50 overflow-hidden">
      
      {/* Background Glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-pulse-slow delay-2000" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-16">
        <div className="relative grid md:grid-cols-2 items-center gap-12
                        bg-white/10 backdrop-blur-xl border border-gray-200/20
                        rounded-3xl p-10 md:p-14 shadow-lg hover:shadow-xl transition-shadow">

          {/* Left Content */}
          <div className="space-y-6 text-center md:text-left">
            <span className="inline-block px-4 py-1 text-sm font-semibold
                             text-blue-600 bg-blue-100/20 rounded-full">
              🚗 Car Marketplace
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              Sell Your Car <br />
              <span className="text-blue-600">Without the Stress</span>
            </h2>

            <p className="text-gray-600 max-w-lg">
              Post your car in minutes, connect with serious buyers, and
              get the best market price — all in one place.
            </p>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <button
                onClick={() => router.push("/sell-car")}
                className="group px-8 py-3 bg-blue-600 text-white rounded-xl
                           font-semibold flex items-center gap-2
                           hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/40
                           transition-all duration-300"
              >
                Sell Your Car
                <span className="group-hover:translate-x-1 transition-transform duration-300">
                  →
                </span>
              </button>

              <button
                onClick={() => router.push("/how-it-works")}
                className="px-8 py-3 border border-blue-200 text-blue-600
                           rounded-xl hover:bg-blue-50 transition-colors"
              >
                How it works
              </button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative flex justify-center md:justify-end">
            <div className="absolute inset-0 bg-blue-200/20 blur-2xl rounded-full animate-pulse-slow" />
            <Image
              src={assets.car}
              alt="Sell Car"
              width={460}
              height={300}
              className="relative object-contain drop-shadow-2xl animate-float"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SellCarCTA;
