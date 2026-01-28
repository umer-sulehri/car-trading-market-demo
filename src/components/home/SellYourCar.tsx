"use client";

import { Check } from "lucide-react";

export default function SellYourCar() {
  return (
    <section className="bg-white py-14">
      <div className="max-w-6xl mx-auto px-4">
        {/* TITLE */}
        <div className="flex items-center gap-4 mb-10">
          <div className="flex-1 h-px bg-gray-300" />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800 text-center whitespace-nowrap">
            Sell Your Car and Get the Best Price
          </h2>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* CONTENT */}
        <div className="relative border rounded-lg p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12">
            {/* LEFT */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-5">
                Sell It Myself!
              </h3>

              <ul className="space-y-3 text-gray-700">
                <ListItem text="Post an ad in 2 minutes" />
                <ListItem text="20 million users" />
                <ListItem text="Connect directly with buyers" />
              </ul>

              <button className="mt-8 bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-md font-medium transition">
                Post Your Ad
              </button>
            </div>

            {/* RIGHT */}
            <div>
              <h3 className="text-xl font-semibold text-blue-800 mb-5">
                Sell It For Me
              </h3>

              <ul className="space-y-3 text-gray-700">
                <ListItem text="Sell your car without hassle" />
                <ListItem text="Free Inspection & Featured ad" />
                <ListItem text="Maximize offer with sales agent" />
              </ul>

              <button className="mt-8 bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-md font-medium transition">
                Help Me Sell My Car!
              </button>
            </div>
          </div>

          {/* OR DIVIDER */}
          <div className="hidden md:flex absolute inset-y-0 left-1/2 -translate-x-1/2 flex-col items-center">
            <div className="flex-1 w-px bg-gray-300" />
            <span className="my-3 text-gray-500 font-semibold">OR</span>
            <div className="flex-1 w-px bg-gray-300" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ================= SUB COMPONENT ================= */

const ListItem = ({ text }: { text: string }) => (
  <li className="flex items-center gap-3">
    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500 text-white">
      <Check size={14} />
    </span>
    <span>{text}</span>
  </li>
);
