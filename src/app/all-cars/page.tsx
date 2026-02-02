"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import apiClient from "@/src/lib/api/apiClient";
import carDummy from "@/src/assets/images/car2.png";
import {
  MapPin,
  Gauge,
  Paintbrush,
  ShieldCheck,
  Phone,
  Heart,
} from "lucide-react";
import { addToFavorites, removeFromFavorites, checkIfFavorited } from "@/src/services/favorite.service";
import { isUserAuthenticated } from "@/src/lib/auth/cookie.utils";

const DUMMY_IMAGE = carDummy;

interface SellCar {
  id: number;
  make?: { id: number; name: string };
  version?: { id: number; name: string; model?: { id: number; name: string } };
  city?: { id: number; name: string };
  transmission?: { id: number; name: string };
  engineType?: { id: number; name: string };
  mileage: number;
  price: number;
  seller_name: string;
  seller_phone: string;
  phone?: string;
  status: string;
  images?: string[];
  media?: Array<{ image: string }>;
  user_id?: number;
}

const AllCars: React.FC = () => {
  const router = useRouter();
  const [cars, setCars] = useState<SellCar[]>([]);
  const [filteredCars, setFilteredCars] = useState<SellCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [favorited, setFavorited] = useState<Set<number>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const CITY_LIST = ["Lahore", "Karachi", "Islamabad", "Rawalpindi"];
  const MAKE_LIST = ["Toyota", "Honda", "Suzuki", "Kia", "BMW"];

  const PRICE_RANGES = [
    { label: "Below 1M", value: "0-1000000" },
    { label: "1M - 2M", value: "1000000-2000000" },
    { label: "2M - 5M", value: "2000000-5000000" },
    { label: "Above 5M", value: "5000000+" },
  ];

  useEffect(() => {
    fetchApprovedCars();
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const isAuth = await isUserAuthenticated();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        // Load favorite cars for this user
        const favorites = await checkIfFavorited(0); // Will be replaced with actual checks
        // We'll check favorites as we render each car
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setIsAuthenticated(false);
    }
  };

  const fetchApprovedCars = async () => {
    try {
      setLoading(true);
      // apiClient already returns res.data directly (see interceptor)
      const response = await apiClient.get("/sell-cars");
      
      // Handle paginated response structure
      const data = Array.isArray(response) 
        ? response 
        : response?.data || [];
      
      const approvedCars = data
        .filter((car: any) => car.status === "approved")
        .map((car: any) => ({
          ...car,
          phone: car.seller_phone,
          images: car.media?.length > 0 
            ? car.media.map((m: any) => m.image || m.media_path) 
            : [],
        }));
      
      setCars(approvedCars);
      setFilteredCars(approvedCars);
    } catch (error) {
      console.error("Error fetching cars:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterCars = (searchValue: string, priceValue: string) => {
    let filtered = cars;

    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter((car) => {
        const make = typeof car.make === "string" ? car.make : car.make?.name || "";
        const model = typeof car.version === "string" ? car.version : car.version?.model?.name || "";
        const city = typeof car.city === "string" ? car.city : car.city?.name || "";
        return (
          make.toLowerCase().includes(search) ||
          model.toLowerCase().includes(search) ||
          city.toLowerCase().includes(search)
        );
      });
    }

    if (priceValue) {
      const [min, max] = priceValue.includes("+")
        ? [parseInt(priceValue), Infinity]
        : priceValue.split("-").map(Number);

      filtered = filtered.filter((car) => car.price >= min && car.price <= max);
    }

    setFilteredCars(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    filterCars(value, priceFilter);
  };

  const handlePriceChange = (value: string) => {
    setPriceFilter(value);
    filterCars(searchTerm, value);
  };

  const handleClick = (id: number) => {
    router.push(`/all-cars/${id}`);
  };

  const toggleFavorite = async (e: React.MouseEvent, carId: number) => {
    e.stopPropagation();
    
    // Check authentication AGAIN right here (not just relying on state)
    const isAuth = await isUserAuthenticated();
    console.log("🔍 Favorite Button Clicked - Auth Check:", isAuth);
    
    if (!isAuth) {
      console.log("❌ Not authenticated, redirecting to login");
      router.push("/auth/login");
      return;
    }

    try {
      console.log("✅ Authenticated, proceeding with favorite toggle");
      if (favorited.has(carId)) {
        await removeFromFavorites(carId);
        setFavorited(prev => {
          const newSet = new Set(prev);
          newSet.delete(carId);
          return newSet;
        });
      } else {
        await addToFavorites(carId);
        setFavorited(prev => new Set(prev).add(carId));
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setPriceFilter("");
    setFilteredCars(cars);
  };

  return (
    <>
      <Navbar />

      <section className="py-10 px-6 md:px-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto flex gap-8 mt-16">

          {/* ================= FILTER SIDEBAR ================= */}
          <aside className="w-72 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24">
            <h3 className="text-lg font-semibold mb-6">Filter Cars</h3>
{/* SEARCH */}
<div className="mb-5">
  <label className="text-sm text-gray-500">Search</label>
  <input
    type="text"
    placeholder="Search by make, model, city"
    value={searchTerm}
    onChange={(e) => handleSearchChange(e.target.value)}
    className="w-full mt-1 border rounded-xl px-4 py-2 text-sm
               focus:ring-2 focus:ring-blue-500 transition"
  />
</div>




            {/* PRICE */}
            <div className="mb-6">
              <label className="text-sm text-gray-500">Price Range</label>
              <select
                value={priceFilter}
                onChange={(e) => handlePriceChange(e.target.value)}
                className="w-full mt-1 border rounded-xl px-4 py-2 text-sm 
                           focus:ring-2 focus:ring-blue-500 transition"
              >
                <option value="">Any Price</option>
                {PRICE_RANGES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-xl text-sm font-medium
                         border hover:bg-gray-100 transition"
            >
              Clear Filters
            </button>
          </aside>

          {/* ================= CARS GRID ================= */}
          <div className="flex-1">
            <h2 className="text-3xl font-semibold mb-6">Available Cars</h2>

            {loading ? (
              <p className="text-gray-500">Loading cars...</p>
            ) : filteredCars.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    onClick={() => handleClick(car.id)}
                    className="bg-white rounded-2xl overflow-hidden 
                               shadow-sm hover:shadow-xl hover:-translate-y-1 
                               transition-all cursor-pointer relative"
                  >
                    {/* FAVORITE BUTTON */}
                    <button
                      onClick={(e) => toggleFavorite(e, car.id)}
                      className="absolute top-3 right-3 z-10 p-2 rounded-full 
                                 bg-white shadow-md hover:shadow-lg transition-all"
                    >
                      <Heart
                        size={20}
                        className={favorited.has(car.id) ? "fill-red-500 text-red-500" : "text-gray-400"}
                      />
                    </button>

                    {/* IMAGE */}
                    <div className="h-48 overflow-hidden">
                      <Image
                        src={
                          car.images && car.images.length > 0
                            ? `${process.env.NEXT_PUBLIC_STORAGE_URL}/${car.images[0]}`
                            : DUMMY_IMAGE
                        }
                        alt={`${car.make} ${car.model}`}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* CONTENT */}
                    <div className="p-4 space-y-2">
                      <h3 className="text-sm font-semibold">
                        {typeof car.make === "string" ? car.make : car.make?.name || "Car"}
                        {" "}
                        {typeof car.version === "string" ? car.version : car.version?.model?.name || ""}
                        {" "}
                        {car.version && typeof car.version !== "string" && car.version.name && `(${car.version.name})`}
                      </h3>

                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin size={14} /> {typeof car.city === "string" ? car.city : car.city?.name || "City"}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 mt-2">
                        <div className="flex items-center gap-1">
                          <Gauge size={14} /> {car.mileage.toLocaleString()} km
                        </div>
                        {car.transmission && (
                          <div className="flex items-center gap-1">
                            <Paintbrush size={14} /> {typeof car.transmission === "string" ? car.transmission : car.transmission?.name || ""}
                          </div>
                        )}
                      </div>
<div className="mt-4 space-y-2">
  <div className="flex justify-between items-center">
    <p className="text-blue-600 font-semibold">
      PKR {car.price.toLocaleString()}
    </p>

    <span
      className={`text-xs px-2 py-1 rounded-full capitalize ${
        car.status === "approved"
          ? "bg-green-100 text-green-600"
          : "bg-gray-100 text-gray-600"
      }`}
    >
      {car.status}
    </span>
  </div>

  {/* ✅ SHOW ONLY IF APPROVED */}
  {car.status === "approved" && (
    <a
      href={`tel:${car.phone || car.seller_phone}`}
      onClick={(e) => e.stopPropagation()}
      className="block text-center text-sm font-medium
                 bg-gradient-to-r from-blue-600 to-blue-500
                 text-white py-2 rounded-xl
                 hover:opacity-90 transition"
    >
      Call Seller
    </a>
  )}
</div>

                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 mt-10">No cars found.</p>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
};

export default AllCars;
