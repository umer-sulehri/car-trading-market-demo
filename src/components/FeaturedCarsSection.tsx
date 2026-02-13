"use client";

import React, { useEffect, useState } from "react";
import { Star, RotateCcw, X } from "lucide-react";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";
import Image from "next/image";

interface FeaturedCar {
  id: number;
  car_id: number;
  plan_id: number;
  status: "active" | "expired" | "cancelled";
  expires_at: string;
  car: {
    id: number;
    title: string;
    price: number;
    image_url: string;
    location: string;
  };
  plan: {
    id: number;
    name: string;
    border_color: string;
    top_listing: boolean;
    urgent_badge: boolean;
  };
}

interface FeaturedCarsSectionProps {
  onRenew?: () => void;
  onCancel?: () => void;
}

export default function FeaturedCarsSection({
  onRenew,
  onCancel,
}: FeaturedCarsSectionProps) {
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedCars();
  }, []);

  const fetchFeaturedCars = async () => {
    try {
      const response = await featuredCarsAPI.getUserFeaturedListings();
      const active = (response.data || []).filter(
        (car: FeaturedCar) => car.status === "active"
      );
      setFeaturedCars(active);
    } catch (error) {
      console.error("Error fetching featured cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (featuredListingId: number) => {
    try {
      await featuredCarsAPI.renewFeatured(featuredListingId);
      fetchFeaturedCars();
      onRenew?.();
    } catch (error) {
      console.error("Error renewing:", error);
    }
  };

  const handleCancel = async (featuredListingId: number) => {
    if (confirm("Are you sure you want to cancel this featured listing?")) {
      try {
        await featuredCarsAPI.cancelFeatured(featuredListingId);
        fetchFeaturedCars();
        onCancel?.();
      } catch (error) {
        console.error("Error cancelling:", error);
      }
    }
  };

  const calculateDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return <div className="text-center py-6 text-gray-500">Loading featured cars...</div>;
  }

  if (featuredCars.length === 0) {
    return null;
  }

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Star size={24} className="text-yellow-500" fill="currentColor" />
        <h2 className="text-2xl font-bold text-gray-900">Your Featured Cars</h2>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
          {featuredCars.length} Active
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {featuredCars.map((featured) => {
          const daysRemaining = calculateDaysRemaining(featured.expires_at);

          return (
            <div
              key={featured.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition border-t-4"
              style={{ borderColor: featured.plan.border_color }}
            >
              {/* Featured Badge */}
              <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-3 py-1 rounded-full text-xs font-bold z-10 flex items-center gap-1 shadow-lg">
                <Star size={14} fill="currentColor" />
                FEATURED
              </div>

              {/* Car Image */}
              <div className="relative h-32 bg-gray-200 group">
                {featured.car.image_url ? (
                  <Image
                    src={featured.car.image_url}
                    alt={featured.car.title}
                    layout="fill"
                    objectFit="cover"
                    className="group-hover:scale-105 transition"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                    <span className="text-gray-500 text-xs">No Image</span>
                  </div>
                )}
              </div>

              {/* Car Info */}
              <div className="p-3">
                <h3 className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                  {featured.car.title}
                </h3>

                <p className="text-lg font-bold text-blue-600 mb-1">
                  Rs {featured.car.price.toLocaleString()}
                </p>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-gray-500">{featured.plan.name}</span>
                  {featured.plan.urgent_badge && (
                    <span className="text-xs font-semibold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                      URGENT
                    </span>
                  )}
                </div>

                {/* Expiration */}
                <div
                  className={`text-xs font-medium px-2 py-1 rounded text-center mb-2 ${
                    daysRemaining <= 3
                      ? "bg-red-100 text-red-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {daysRemaining} days left
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleRenew(featured.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-2 py-1.5 rounded text-xs hover:bg-blue-700 transition font-semibold"
                  >
                    <RotateCcw size={12} />
                    Renew
                  </button>
                  <button
                    onClick={() => handleCancel(featured.id)}
                    className="flex-1 flex items-center justify-center gap-1 bg-red-100 text-red-700 px-2 py-1.5 rounded text-xs hover:bg-red-200 transition font-semibold"
                  >
                    <X size={12} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
