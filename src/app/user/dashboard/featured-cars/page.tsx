"use client";

import React, { useEffect, useState } from "react";
import { Star, Clock, X, RotateCcw, TrendingUp } from "lucide-react";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";
import Image from "next/image";

interface FeaturedCar {
  id: number;
  car_id: number;
  plan_id: number;
  status: "active" | "expired" | "cancelled";
  starts_at: string;
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
    price: number;
    border_color: string;
    top_listing: boolean;
    urgent_badge: boolean;
    homepage_slider: boolean;
    daily_renew: boolean;
  };
}

interface UserCredits {
  available_credits: number;
  used_credits: number;
  total_credits: number;
}

export default function FeaturedCarsPage() {
  const [featuredCars, setFeaturedCars] = useState<FeaturedCar[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"active" | "history">("active");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carsRes, creditsRes] = await Promise.all([
        featuredCarsAPI.getUserFeaturedListings(),
        featuredCarsAPI.getUserCredits(),
      ]);
      setFeaturedCars(carsRes.data || []);
      setCredits(creditsRes.data || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenew = async (featuredListingId: number) => {
    try {
      await featuredCarsAPI.renewFeatured(featuredListingId);
      fetchData();
    } catch (error) {
      console.error("Error renewing:", error);
      alert("Error renewing featured listing");
    }
  };

  const handleCancel = async (featuredListingId: number) => {
    if (confirm("Are you sure you want to cancel this featured listing?")) {
      try {
        await featuredCarsAPI.cancelFeatured(featuredListingId);
        fetchData();
      } catch (error) {
        console.error("Error cancelling:", error);
        alert("Error cancelling featured listing");
      }
    }
  };

  const calculateDaysRemaining = (expiresAt: string) => {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffTime = expires.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const activeFeaturedCars = featuredCars.filter((car) => car.status === "active");
  const expiredCars = featuredCars.filter((car) => car.status !== "active");

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Featured Cars</h1>
          <p className="text-gray-600">Manage your featured car listings and credits</p>
        </div>

        {/* Credits Card */}
        {credits && (
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-lg p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-blue-400 bg-opacity-30 p-4 rounded-full">
                  <TrendingUp size={32} />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Available Credits</p>
                  <p className="text-4xl font-bold">{credits.available_credits}</p>
                  <p className="text-blue-100 text-xs mt-1">
                    Used: {credits.used_credits} / Total: {credits.total_credits}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-semibold">Ready to Feature</p>
                <p className="text-sm text-blue-100">Feature your cars with credits</p>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab("active")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "active"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            Active Featured ({activeFeaturedCars.length})
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`px-6 py-3 rounded-lg font-medium transition ${
              activeTab === "history"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-gray-50"
            }`}
          >
            History ({expiredCars.length})
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : activeTab === "active" ? (
          <>
            {activeFeaturedCars.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <Star size={48} className="mx-auto text-gray-300 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Featured Cars
                </h3>
                <p className="text-gray-600 mb-6">
                  You haven't featured any cars yet. Feature your cars to get more visibility!
                </p>
                <a
                  href="/user/dashboard/cars/all"
                  className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  View Your Cars
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {activeFeaturedCars.map((featured) => {
                  const daysRemaining = calculateDaysRemaining(featured.expires_at);
                  const isExpiringSoon = daysRemaining <= 3;

                  return (
                    <div
                      key={featured.id}
                      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
                      style={{
                        borderTop: `4px solid ${featured.plan.border_color}`,
                      }}
                    >
                      {/* Featured Badge */}
                      <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-xs font-semibold z-10 flex items-center gap-1">
                        <Star size={12} fill="currentColor" />
                        FEATURED
                      </div>

                      {/* Car Image */}
                      <div className="relative h-48 bg-gray-200">
                        {featured.car.image_url ? (
                          <Image
                            src={featured.car.image_url}
                            alt={featured.car.title}
                            layout="fill"
                            objectFit="cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                            <span className="text-gray-500">No Image</span>
                          </div>
                        )}
                      </div>

                      {/* Car Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2 truncate">
                          {featured.car.title}
                        </h3>

                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <p className="text-2xl font-bold text-blue-600">
                              Rs {featured.car.price.toLocaleString()}
                            </p>
                            <p className="text-sm text-gray-500">
                              {featured.car.location}
                            </p>
                          </div>
                        </div>

                        {/* Plan Info */}
                        <div className="bg-gray-50 p-3 rounded-lg mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              {featured.plan.name}
                            </span>
                            <span className="text-xs font-semibold text-white bg-blue-600 px-2 py-1 rounded">
                              Rs {featured.plan.price}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {featured.plan.top_listing && (
                              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                Top Listed
                              </span>
                            )}
                            {featured.plan.urgent_badge && (
                              <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                                Urgent
                              </span>
                            )}
                            {featured.plan.homepage_slider && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                                Homepage
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Expiration */}
                        <div
                          className={`flex items-center gap-2 p-2 rounded-lg mb-4 ${
                            isExpiringSoon
                              ? "bg-red-50 text-red-700"
                              : "bg-green-50 text-green-700"
                          }`}
                        >
                          <Clock size={16} />
                          <span className="text-sm font-medium">
                            {daysRemaining} days remaining
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRenew(featured.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium text-sm"
                          >
                            <RotateCcw size={16} />
                            Renew
                          </button>
                          <button
                            onClick={() => handleCancel(featured.id)}
                            className="flex-1 flex items-center justify-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition font-medium text-sm"
                          >
                            <X size={16} />
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {expiredCars.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500">No expired or cancelled listings</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {expiredCars.map((featured) => (
                  <div
                    key={featured.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden opacity-75"
                  >
                    <div className="relative h-48 bg-gray-200">
                      {featured.car.image_url ? (
                        <Image
                          src={featured.car.image_url}
                          alt={featured.car.title}
                          layout="fill"
                          objectFit="cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                          <span className="text-gray-500">No Image</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                        <span className="text-white font-bold text-lg">
                          {featured.status === "expired" ? "EXPIRED" : "CANCELLED"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {featured.car.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        Ended: {new Date(featured.expires_at).toLocaleDateString()}
                      </p>
                      <a
                        href={`/user/dashboard/cars/${featured.car_id}`}
                        className="inline-block text-blue-600 hover:text-blue-700 font-medium text-sm"
                      >
                        View Car →
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
