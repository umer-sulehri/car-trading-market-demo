"use client";

import { useEffect, useState } from "react";
import { getMySellCars } from "@/src/services/adminSellCar.service";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";
import { CheckCircle, Clock, XCircle, MapPin, Gauge, Star, Sparkles } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getImageUrl } from "@/src/utils/imageUtils";

interface SellCar {
  id: number;
  make_id: number;
  version_id: number;
  price: number;
  mileage: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  make?: { id: number; name: string };
  version?: { id: number; name: string; model?: { name: string } };
  city?: { name: string };
  media?: { id: number; image: string; media_path: string }[];
}

interface UserCredits {
  available_credits: number;
  used_credits: number;
  total_credits: number;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function AllCarsPage() {
  const router = useRouter();
  const [sellCars, setSellCars] = useState<SellCar[]>([]);
  const [credits, setCredits] = useState<UserCredits | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");
  const [selectedCarForFeature, setSelectedCarForFeature] = useState<number | null>(null);
  const [featuring, setFeaturing] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [carsData, creditsData] = await Promise.all([
        getMySellCars(),
        featuredCarsAPI.getUserCredits().catch(() => ({ data: null })),
      ]);
      setSellCars(carsData?.data || carsData || []);
      setCredits(creditsData?.data || null);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureCar = async () => {
    if (!selectedCarForFeature) return;

    try {
      setFeaturing(true);
      // Don't send plan_id - backend will get it from user's credits
      await featuredCarsAPI.createFeatureWithCredits(selectedCarForFeature);
      alert("Car featured successfully! 🎉");
      setSelectedCarForFeature(null);
      fetchData(); // Refresh credits
    } catch (error: any) {
      console.error("Error featuring car:", error);
      const message = error?.response?.data?.message || "Error featuring car. Please try again.";
      alert(message);
    } finally {
      setFeaturing(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium">
            <CheckCircle className="w-3 h-3" />
            Approved
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium">
            <Clock className="w-3 h-3" />
            Pending
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-medium">
            <XCircle className="w-3 h-3" />
            Rejected
          </div>
        );
      default:
        return null;
    }
  };

  const filteredCars = filter === "all" ? sellCars : sellCars.filter(c => c.status === filter);
  const pendingCount = sellCars.filter(c => c.status === "pending").length;
  const approvedCount = sellCars.filter(c => c.status === "approved").length;
  const rejectedCount = sellCars.filter(c => c.status === "rejected").length;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Cars</h1>
            <p className="text-gray-600 mt-1">Manage and feature your car listings</p>
          </div>
          <Link
            href="/sell-car"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            + Add New Car
          </Link>
        </div>

        {/* Credits Card */}
        {credits && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg shadow-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="bg-white/20 p-3 rounded-full">
                  <Sparkles size={28} />
                </div>
                <div>
                  <p className="text-sm opacity-90">Available Credits</p>
                  <p className="text-3xl font-bold">{credits.available_credits}</p>
                  <p className="text-xs opacity-75 mt-1">
                    Used: {credits.used_credits} / Total: {credits.total_credits}
                  </p>
                </div>
              </div>
              <Link
                href="/feature-plans"
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Buy More Credits
              </Link>
            </div>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-gray-900">{sellCars.length}</div>
            <div className="text-sm text-gray-600">Total Cars</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            <div className="text-sm text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
            <div className="text-sm text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
            <div className="text-sm text-gray-600">Rejected</div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-1 inline-flex gap-1">
          {(["all", "pending", "approved", "rejected"] as const).map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-6 py-2 rounded-md font-medium capitalize transition-all ${filter === status
                ? "bg-blue-600 text-white shadow-sm"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading your cars...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCars.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <p className="text-gray-600 text-lg mb-4">No cars found</p>
            <Link
              href="/sell-car"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Add your first car for sale →
            </Link>
          </div>
        )}

        {/* Cars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCars.map((car) => (
            <div
              key={car.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all overflow-hidden border border-gray-100"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-100 overflow-hidden">
                {car.media && car.media[0] ? (
                  <img
                    src={getImageUrl(car.media[0].image || car.media[0].media_path)}
                    alt={`${car.make?.name} ${car.version?.name}`}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(car.status)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                {/* Title */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">
                    {car.make?.name} {car.version?.name}
                  </h3>
                  <p className="text-sm text-gray-500">{car.version?.model?.name}</p>
                </div>

                {/* Price and Mileage */}
                <div className="flex justify-between items-center pt-2 border-t">
                  <div className="text-xl font-bold text-green-600">
                    Rs. {car.price?.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <Gauge className="w-4 h-4" />
                    {car.mileage?.toLocaleString()} km
                  </div>
                </div>

                {/* Location */}
                {car.city && (
                  <div className="text-sm text-gray-600 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {car.city.name}
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {car.status === "approved" && credits && credits.available_credits > 0 && (
                    <button
                      onClick={() => setSelectedCarForFeature(car.id)}
                      className="flex-1 px-3 py-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all text-sm font-semibold flex items-center justify-center gap-1"
                    >
                      <Star className="w-4 h-4" />
                      Feature
                    </button>
                  )}
                  <Link
                    href={`/user/dashboard/cars/${car.id}`}
                    className={`${car.status === "approved" && credits && credits.available_credits > 0 ? 'flex-1' : 'flex-[2]'} px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium text-center`}
                  >
                    View
                  </Link>
                  <Link
                    href={`/user/dashboard/cars/${car.id}/edit`}
                    className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium text-center"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Car Modal */}
      {selectedCarForFeature && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCarForFeature(null)}>
          <div className="bg-white rounded-2xl max-w-md w-full" onClick={(e) => e.stopPropagation()}>
            <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <Star className="w-6 h-6 fill-current" />
                    Feature This Car?
                  </h2>
                  <p className="text-yellow-100 text-sm mt-1">
                    Boost your car's visibility
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCarForFeature(null)}
                  className="text-white hover:text-yellow-100 text-3xl font-bold leading-none"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Car Info */}
              {(() => {
                const car = sellCars.find(c => c.id === selectedCarForFeature);
                return car ? (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-center gap-4">
                      {car.media && car.media[0] ? (
                        <img
                          src={getImageUrl(car.media[0].image || car.media[0].media_path)}
                          alt={`${car.make?.name} ${car.version?.name}`}
                          className="w-20 h-20 object-cover rounded-lg"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                          }}
                        />
                      ) : (
                        <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-gray-400">
                          No Image
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900">{car.make?.name} {car.version?.name}</h3>
                        <p className="text-sm text-gray-600">Rs. {car.price?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Credits & Cost */}
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-sm text-gray-600">Available Credits</p>
                    <p className="text-2xl font-bold text-blue-600">{credits?.available_credits || 0}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Cost</p>
                    <p className="text-2xl font-bold text-orange-600">1 Credit</p>
                  </div>
                </div>

                {credits && credits.available_credits > 0 && (
                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                    <p className="text-sm text-gray-700">After featuring:</p>
                    <p className="text-lg font-bold text-green-700">{credits.available_credits - 1} Credits</p>
                  </div>
                )}

                {credits && credits.available_credits === 0 && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <p className="text-red-700 font-medium mb-3">No credits available</p>
                    <Link
                      href="/feature-plans"
                      className="inline-block bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                    >
                      Buy Credits Now
                    </Link>
                  </div>
                )}
              </div>

              {/* What You Get */}
              {credits && credits.available_credits > 0 && (
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    Your car will be featured with:
                  </h4>
                  <ul className="space-y-1 text-sm text-gray-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Premium positioning in listings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Eye-catching visual styling
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Increased visibility to buyers
                    </li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-3">
                    * Based on your purchased plan features
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setSelectedCarForFeature(null)}
                  className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleFeatureCar}
                  disabled={featuring || !credits || credits.available_credits === 0}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {featuring ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                      Featuring...
                    </>
                  ) : (
                    <>
                      <Star className="w-5 h-5 fill-current" />
                      Feature Now
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
