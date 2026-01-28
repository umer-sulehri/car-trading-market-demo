"use client";

import { useEffect, useState } from "react";
import { getMySellCars } from "@/src/services/adminSellCar.service";
import { CheckCircle, Clock, XCircle, MapPin, Fuel, Zap, DollarSign, Gauge } from "lucide-react";
import Link from "next/link";

interface SellCar {
  id: number;
  make_id: number;
  version_id: number;
  price: number;
  mileage: number;
  capacity?: number;
  assembly_type?: string;
  whatsapp_allowed?: boolean;
  seller_name: string;
  seller_phone: string;
  secondary_phone?: string;
  registered_city?: string;
  registered_province?: string;
  description?: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  updated_at?: string;
  make?: { id: number; name: string };
  version?: { id: number; name: string; model?: { name: string } };
  city?: { name: string; province?: { name: string } };
  engineType?: { id: number; name: string };
  transmission?: { id: number; name: string };
  media?: { id: number; image: string; media_path: string }[];
  features?: Array<{ id: number; name: string }>;
}

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' font-size='18' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function AllCarsPage() {
  const [sellCars, setSellCars] = useState<SellCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCar, setSelectedCar] = useState<SellCar | null>(null);
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  useEffect(() => {
    fetchSellCars();
  }, []);

  const fetchSellCars = async () => {
    try {
      const data = await getMySellCars();
      setSellCars(data?.data || data || []);
    } catch (error) {
      console.error("Error fetching sell cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium">
            <CheckCircle className="w-4 h-4" />
            Approved
          </div>
        );
      case "pending":
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Pending
          </div>
        );
      case "rejected":
        return (
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium">
            <XCircle className="w-4 h-4" />
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
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">My Cars</h1>
        <Link
          href="/sell-car"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Add New Car
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-gray-800">{sellCars.length}</div>
          <div className="text-sm text-gray-600">Total Cars</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
          <div className="text-sm text-gray-600">Pending Approval</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-green-600">{approvedCount}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="text-2xl font-bold text-red-600">{rejectedCount}</div>
          <div className="text-sm text-gray-600">Rejected</div>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-4 border-b">
        {(["all", "pending", "approved", "rejected"] as const).map(status => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-4 py-2 font-medium capitalize transition-colors ${
              filter === status
                ? "border-b-2 border-blue-600 text-blue-600"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            {status} ({status === "all" ? sellCars.length : sellCars.filter(c => c.status === status).length})
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading your cars...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredCars.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 mb-4">No cars found</p>
          <Link
            href="/sell-car"
            className="text-blue-600 hover:underline"
          >
            Add your first car for sale
          </Link>
        </div>
      )}

      {/* Cars Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCars.map((car) => (
          <div
            key={car.id}
            className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden cursor-pointer"
            onClick={() => setSelectedCar(car)}
          >
            {/* Image */}
            <div className="relative h-56 bg-gray-200 overflow-hidden">
              {car.media && car.media[0] ? (
                <img
                  src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${car.media[0].image || car.media[0].media_path}`}
                  alt={`${car.make?.name} ${car.version?.name}`}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-500">No image</span>
                </div>
              )}
              <div className="absolute top-4 right-4">
                {getStatusBadge(car.status)}
              </div>
              {car.media && car.media.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                  +{car.media.length - 1} more
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-4 space-y-4">
              {/* Title */}
              <div>
                <h3 className="text-xl font-bold text-gray-800">
                  {car.make?.name} {car.version?.name}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {car.version?.model?.name}
                </p>
              </div>

              {/* Price and Mileage */}
              <div className="flex justify-between items-center">
                <div className="text-2xl font-bold text-green-600">
                  Rs. {car.price?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Gauge className="w-4 h-4" />
                  {car.mileage?.toLocaleString()} km
                </div>
              </div>

              {/* Specs */}
              <div className="grid grid-cols-2 gap-3 py-3 border-t border-b">
                {car.engineType && (
                  <div className="text-sm">
                    <div className="text-gray-600 flex items-center gap-1">
                      <Fuel className="w-4 h-4" />
                      Engine
                    </div>
                    <div className="font-semibold text-gray-800">{car.engineType.name}</div>
                  </div>
                )}
                {car.capacity && (
                  <div className="text-sm">
                    <div className="text-gray-600 flex items-center gap-1">
                      <Zap className="w-4 h-4" />
                      Capacity
                    </div>
                    <div className="font-semibold text-gray-800">{car.capacity} cc</div>
                  </div>
                )}
                {car.transmission && (
                  <div className="text-sm">
                    <div className="text-gray-600">Transmission</div>
                    <div className="font-semibold text-gray-800">{car.transmission.name}</div>
                  </div>
                )}
                {car.assembly_type && (
                  <div className="text-sm">
                    <div className="text-gray-600">Assembly</div>
                    <div className="font-semibold text-gray-800">{car.assembly_type}</div>
                  </div>
                )}
              </div>

              {/* Location */}
              {car.city && (
                <div className="text-sm flex items-center gap-2 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {car.city.name}
                  {car.city.province && `, ${car.city.province.name}`}
                </div>
              )}

              {/* Seller Info */}
              <div className="bg-gray-50 p-3 rounded text-sm space-y-1">
                <div>
                  <span className="text-gray-600">Seller: </span>
                  <span className="font-semibold">{car.seller_name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Phone: </span>
                  <span className="font-semibold">{car.seller_phone}</span>
                </div>
                {car.secondary_phone && (
                  <div>
                    <span className="text-gray-600">Secondary: </span>
                    <span className="font-semibold">{car.secondary_phone}</span>
                  </div>
                )}
                {car.whatsapp_allowed && (
                  <div className="text-green-600 text-xs font-semibold">✓ WhatsApp Available</div>
                )}
              </div>

              {/* Features */}
              {car.features && car.features.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm text-gray-700 mb-2">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {car.features.map((feature) => (
                      <span
                        key={feature.id}
                        className="inline-block bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs"
                      >
                        {feature.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Date */}
              <div className="text-xs text-gray-500">
                Listed on {new Date(car.created_at).toLocaleDateString()}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-2">
                <Link
                  href={`/user/dashboard/cars/${car.id}`}
                  className="flex-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium text-center"
                >
                  View Details
                </Link>
                <Link
                  href={`/user/dashboard/cars/${car.id}/edit`}
                  className="flex-1 px-3 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors text-sm font-medium text-center"
                >
                  Edit
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Car Details */}
      {selectedCar && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedCar(null)}>
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-96 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">
                {selectedCar.make?.name} {selectedCar.version?.name}
              </h2>
              <button
                onClick={() => setSelectedCar(null)}
                className="text-2xl font-bold text-gray-600 hover:text-gray-800"
              >
                ×
              </button>
            </div>
            <div className="p-6 space-y-4">
              {/* Images */}
              {selectedCar.media && selectedCar.media.length > 0 && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Images ({selectedCar.media.length})</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {selectedCar.media.map((m) => (
                      <img
                        key={m.id}
                        src={`${process.env.NEXT_PUBLIC_STORAGE_URL}/${m.image || m.media_path}`}
                        alt="Car"
                        className="w-full h-24 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = PLACEHOLDER_IMAGE;
                        }}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Description */}
              {selectedCar.description && (
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-700">{selectedCar.description}</p>
                </div>
              )}

              {/* All Details */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-gray-600">Price:</span>
                  <div className="font-semibold text-lg text-green-600">Rs. {selectedCar.price?.toLocaleString()}</div>
                </div>
                <div>
                  <span className="text-gray-600">Mileage:</span>
                  <div className="font-semibold">{selectedCar.mileage?.toLocaleString()} km</div>
                </div>
                <div>
                  <span className="text-gray-600">Registered City:</span>
                  <div className="font-semibold">{selectedCar.registered_city}</div>
                </div>
                <div>
                  <span className="text-gray-600">Registered Province:</span>
                  <div className="font-semibold">{selectedCar.registered_province}</div>
                </div>
                <div>
                  <span className="text-gray-600">Engine Type:</span>
                  <div className="font-semibold">{selectedCar.engineType?.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Capacity:</span>
                  <div className="font-semibold">{selectedCar.capacity} cc</div>
                </div>
                <div>
                  <span className="text-gray-600">Transmission:</span>
                  <div className="font-semibold">{selectedCar.transmission?.name}</div>
                </div>
                <div>
                  <span className="text-gray-600">Assembly:</span>
                  <div className="font-semibold">{selectedCar.assembly_type}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
