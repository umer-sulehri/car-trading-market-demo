"use client";

import {
  ShieldCheck,
  Zap,
  Wallet,
  MapPin,
  Users,
  Headset,
} from "lucide-react";

const features = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    description:
      "Every car listing goes through a verification process to ensure authenticity and prevent fraud.",
  },
  {
    icon: Zap,
    title: "Quick & Easy Process",
    description:
      "List your car in minutes and start receiving buyer inquiries within hours — no complicated steps.",
  },
  {
    icon: Wallet,
    title: "Zero Commission",
    description:
      "Sell your car without paying any commission or hidden charges. What you earn is yours.",
  },
  {
    icon: MapPin,
    title: "Nationwide Reach",
    description:
      "Connect with buyers from multiple cities and expand your selling opportunities effortlessly.",
  },
  {
    icon: Users,
    title: "Real Buyers Only",
    description:
      "We prioritize genuine buyers to ensure serious inquiries and faster deal closures.",
  },
  {
    icon: Headset,
    title: "Dedicated Support",
    description:
      "Our support team is always available to assist you at every step of the selling journey.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="relative py-24 bg-gradient-to-b from-blue-50 to-blue-100 overflow-hidden">
      {/* Background soft glows */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-200/20 rounded-full blur-3xl animate-pulse-slow delay-2000" />

      <div className="relative max-w-7xl mx-auto px-6 md:px-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-blue-900">
            Why Choose <span className="text-blue-600">Us</span>
          </h2>
          <p className="text-blue-800 text-lg">
            We provide a fast, reliable, and transparent platform to sell your car with confidence and ease.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, idx) => (
            <div
              key={idx}
              className="group relative bg-white/30 backdrop-blur-lg border border-blue-100
                         rounded-3xl p-8 flex flex-col items-start
                         hover:border-blue-400 hover:shadow-[0_0_25px_rgb(59,130,246/0.25)]
                         transition-all duration-300 cursor-pointer"
            >
              {/* Icon */}
              <div className="w-16 h-16 flex items-center justify-center
                              rounded-xl bg-blue-100/30 text-blue-600 mb-6
                              group-hover:bg-blue-200/50 group-hover:scale-105
                              transition-all duration-300 shadow-md">
                <feature.icon size={28} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold mb-3 text-blue-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-blue-800 leading-relaxed">{feature.description}</p>

              {/* Accent line */}
              <span className="absolute bottom-0 left-0 w-16 h-1 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300"></span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
