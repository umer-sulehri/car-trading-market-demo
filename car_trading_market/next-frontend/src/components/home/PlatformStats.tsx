"use client";

import { Car, Users, MapPin, Clock } from "lucide-react";

const stats = [
  {
    icon: Car,
    value: "12,500+",
    label: "Cars Listed",
  },
  {
    icon: Users,
    value: "8,200+",
    label: "Happy Sellers",
  },
  {
    icon: MapPin,
    value: "35+",
    label: "Cities Covered",
  },
  {
    icon: Clock,
    value: "24 hrs",
    label: "Avg. Response Time",
  },
];

export default function PlatformStats() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-16 text-center">
        {/* Section Header */}
        <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
          Our Platform at a Glance
        </h2>
        <p className="text-gray-600 mb-12 max-w-2xl mx-auto">
          Thousands of sellers trust us to sell their cars quickly, safely, and for the best price.
        </p>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition"
            >
              <stat.icon className="mx-auto mb-4 text-blue-600" size={36} />
              <h3 className="text-3xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-gray-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
