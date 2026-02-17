"use client";

import { FC, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Zap, Settings, MapPin, Star } from "lucide-react";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";
import { assets } from "@/src/assets/js/assets";
import { getImageUrl } from "@/src/utils/imageUtils";

interface FeaturedListing {
  id: number;
  car: {
    id: number;
    title: string;
    price: number;
    mileage: number;
    media: Array<{ image: string }>;
    city?: { name: string };
    engine_type?: { name: string };
    transmission?: { name: string };
    version?: { name: string; model?: { name: string } };
  };
  plan: {
    name: string;
    border_color: string;
    urgent_badge: boolean;
  };
}

const TrendingCars: FC = () => {
  const router = useRouter();
  const [featuredCars, setFeaturedCars] = useState<FeaturedListing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await featuredCarsAPI.getPublicFeaturedListings();
        if (res.success) {
          setFeaturedCars(res.data || []);
        }
      } catch (err) {
        console.error("Error fetching featured cars:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleExplore = () => {
    router.push("/all-cars");
  };

  const handleCarClick = (id: number) => {
    router.push(`/all-cars/${id}`);
  };

  return (
    <section className="py-16 text-center bg-gray-50">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex items-center justify-center gap-2 mb-2 text-blue-600">
          <Star size={20} fill="currentColor" />
          <span className="text-sm font-bold uppercase tracking-wider">Premium Selection</span>
        </div>
        <h2 className="text-4xl text-black font-bold">Featured Vehicles</h2>
        <p className="text-gray-500 mt-2 text-sm max-w-xl mx-auto">
          Explore our premium featured listings. These vehicles are vetted and prioritized for your convenience.
        </p>

        {/* Cards Grid */}
        <div className="flex flex-wrap justify-center gap-8 mt-10">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="w-80 h-96 bg-white rounded-xl shadow-md animate-pulse" />
            ))
          ) : featuredCars.length > 0 ? (
            featuredCars.map((listing) => (
              <div
                key={listing.id}
                onClick={() => handleCarClick(listing.car.id)}
                className="w-80 bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all cursor-pointer border-t-4"
                style={{ borderColor: listing.plan?.border_color || "#3b82f6" }}
              >
                <div className="h-48 w-full relative">
                  <Image
                    src={getImageUrl(listing.car.media?.[0]?.image) || assets.car1}
                    alt={listing.car.title}
                    className="h-full w-full object-cover hover:scale-105 transition duration-500"
                    width={400}
                    height={250}
                  />
                  <div className="absolute top-2 left-2 flex flex-col gap-2">
                    <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">
                      FEATURED
                    </span>
                    {listing.plan?.urgent_badge && (
                      <span className="bg-red-600 text-white text-[10px] px-2 py-1 rounded font-bold shadow-sm">
                        URGENT
                      </span>
                    )}
                  </div>
                </div>
                <div className="p-4 text-left space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-black font-bold line-clamp-2">{listing.car.title}</h3>
                  </div>
                  <p className="text-lg font-bold text-blue-600">
                    Rs {listing.car.price.toLocaleString()}
                  </p>

                  <div className="flex justify-between text-[11px] text-gray-500 border-t pt-2 gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-1">
                        <User size={12} className="text-gray-400" />
                        <span>{listing.car.version?.model?.name || "Premium"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Zap size={12} className="text-gray-400" />
                        <span>{listing.car.mileage.toLocaleString()} KM</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1 flex-1">
                      <div className="flex items-center gap-1">
                        <Settings size={12} className="text-gray-400" />
                        <span>{listing.car.transmission?.name || "Auto"}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin size={12} className="text-gray-400" />
                        <span className="truncate">{listing.car.city?.name || "Pakistan"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No featured vehicles available at the moment.</p>
          )}
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-12">
          <button
            onClick={handleExplore}
            className="px-8 py-3 rounded-full bg-blue-600 text-white font-semibold text-sm flex items-center gap-2 hover:bg-blue-700 hover:shadow-lg transition-all"
          >
            Explore All Vehicles
            <Image src={assets.arrow_icon} alt="arrow" className="h-4 w-4 brightness-0 invert" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default TrendingCars;
