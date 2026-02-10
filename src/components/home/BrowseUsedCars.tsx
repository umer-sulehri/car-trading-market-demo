"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getPublicCities, getPublicMakes, getPublicModels, getPublicBodyTypes } from "@/src/services/admin.lookup.service";

type Category = "city" | "make" | "budget" | "bodyType" | null;

const BUDGETS = ["Below 1M", "1M – 2M", "2M – 3M", "3M – 5M", "Above 5M"];

interface DataItem {
  id?: number;
  name?: string;
  [key: string]: any;
}

export default function BrowseUsedCars() {
  const router = useRouter();
  const [active, setActive] = useState<Category>("city");
  const [data, setData] = useState<DataItem[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch data based on category with timeout protection
  useEffect(() => {
    const fetchData = async () => {
      if (!active) {
        setData([]);
        return;
      }

      setLoading(true);
      try {
        let responseData: any[] = [];

        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Request timeout")), 8000) // 8 second timeout
        );

        switch (active) {
          case "city":
            responseData = await Promise.race([getPublicCities(), timeoutPromise]) as any[];
            break;
          case "make":
            responseData = await Promise.race([getPublicMakes(), timeoutPromise]) as any[];
            break;
          case "bodyType":
            responseData = await Promise.race([getPublicBodyTypes(), timeoutPromise]) as any[];
            break;
          case "budget":
            responseData = BUDGETS.map((budget, idx) => ({
              id: idx,
              name: budget,
            }));
            break;
        }

        setData(responseData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [active]);

  const handleCategoryClick = (item: DataItem) => {
    // Navigate to all cars with filter
    const params = new URLSearchParams();

    switch (active) {
      case "city":
        params.append("city", item.name || "");
        break;
      case "make":
        params.append("make", item.name || "");
        break;
      case "bodyType":
        params.append("bodyType", item.name || "");
        break;
      case "budget":
        params.append("budget", item.name || "");
        break;
    }

    router.push(`/all-cars?${params.toString()}`);
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
          <CategoryTab label="Budget" active={active === "budget"} onClick={() => setActive("budget")} />
          <CategoryTab label="Body Type" active={active === "bodyType"} onClick={() => setActive("bodyType")} />
        </div>

        {/* OPTIONS GRID */}
        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : data.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No {active} available
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {data.map((item) => (
                <button
                  key={item.id || item.name}
                  onClick={() => handleCategoryClick(item)}
                  className="px-4 py-3 bg-white rounded-2xl border border-gray-200 shadow-sm
                           text-gray-700 text-sm font-medium hover:bg-blue-50 hover:border-blue-200
                           hover:text-blue-600 transition-all duration-300"
                >
                  {item.name}
                </button>
              ))}
            </div>
          )}
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
        : "bg-white text-gray-700 border border-gray-200 hover:bg-blue-50 hover:text-blue-600"}`}
  >
    {label}
  </button>
);
