"use client";

import { FC } from "react";
import { assets } from "@/src/assets/js/assets";
import Image from "next/image";

const ModeSelector: FC = () => {
  return (
    <section className="bg-blue-600 text-white py-16 px-6 md:px-16">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-10">
        {/* Left Column: Text */}
        <div className="flex-1 text-left">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Choose Your Mode
          </h2>

          <p className="text-blue-100 mb-6 max-w-lg">
            Select an option below to start your journey. Whether you want to
            buy, sell, or participate in an auction, we've got you covered.
          </p>

          <button className="px-8 py-3 bg-black text-white rounded-lg font-semibold hover:bg-gray-800 transition">
            Get Started
          </button>
        </div>

        {/* Right Column: Image */}
        <div className="flex-1 flex justify-center md:justify-end">
         <Image
  src={assets.car_mode} // This is StaticImageData
  alt="Mode Illustration"
  className="w-full max-w-md"
  width={1000}      // Adjust based on your design
  height={800}     // Adjust based on your design
/>
        </div>
      </div>
    </section>
  );
};

export default ModeSelector;
