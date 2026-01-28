"use client";

import { useState } from "react";

type Category = "city" | "make" | "model" | "budget" | "bodyType" | null;

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];
const MAKES = ["Toyota", "Honda", "Suzuki", "KIA", "Hyundai", "Nissan", "BMW", "Audi", "Mercedes"];
const MODELS = ["Corolla", "Civic", "City", "Yaris", "Vitz", "Alto", "Sportage", "Tucson"];
const BUDGETS = ["Below 1M", "1M – 2M", "2M – 3M", "3M – 5M", "Above 5M"];
const BODY_TYPES = ["SUV", "Hatchback", "Sedan", "Van", "Pickup", "Coupe", "Convertible"];

export default function BrowseUsedCars() {
  const [active, setActive] = useState<Category>("city");

  const getData = () => {
    switch (active) {
      case "city": return CITIES;
      case "make": return MAKES;
      case "model": return MODELS;
      case "budget": return BUDGETS;
      case "bodyType": return BODY_TYPES;
      default: return [];
    }
  };

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 md:px-16">
        {/* Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center md:text-left">
          Browse Used Cars
        </h2>

        {/* CATEGORY TABS */}
        <div className="flex flex-wrap gap-4 justify-center md:justify-start border-b border-gray-200 pb-4">
          <CategoryTab label="City" active={active === "city"} onClick={() => setActive("city")} />
          <CategoryTab label="Make" active={active === "make"} onClick={() => setActive("make")} />
          <CategoryTab label="Model" active={active === "model"} onClick={() => setActive("model")} />
          <CategoryTab label="Budget" active={active === "budget"} onClick={() => setActive("budget")} />
          <CategoryTab label="Body Type" active={active === "bodyType"} onClick={() => setActive("bodyType")} />
        </div>

        {/* OPTIONS GRID */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {getData().map((item) => (
            <button
              key={item}
              className="px-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm
                         text-gray-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-200
                         hover:text-blue-600 transition-all duration-300"
              onClick={() => console.log(active, item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ================= CATEGORY TAB BUTTON ================= */
const CategoryTab = ({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className={`px-5 py-2 rounded-full text-sm font-semibold transition
      ${active 
        ? "bg-blue-600 text-white shadow-md border border-blue-600" 
        : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600"}`
    }
  >
    {label}
  </button>
);
