"use client";

import { Metadata } from "next";
import { getSEOConfig, generateMetadata as generateSEOMetadata } from "@/config/seo";
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
  ChevronDown,
} from "lucide-react";
import { addToFavorites, removeFromFavorites, getFavoriteCars } from "@/src/services/favorite.service";
import { isUserAuthenticated } from "@/src/lib/auth/cookie.utils";

const DUMMY_IMAGE = carDummy;

interface SellCar {
  id: number;
  make?: { id: number; name: string };
  model?: { id: number; name: string };
  version?: { id: number; name: string; model?: { id: number; name: string } };
  city?: { id: number; name: string };
  province?: { id: number; name: string };
  transmission?: { id: number; name: string };
  engineType?: { id: number; name: string };
  color?: { id: number; name: string };
  bodyType?: { id: number; name: string };
  mileage: number;
  price: number;
  year?: number;
  engine_capacity?: number;
  registered_in?: string;
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
  const [cityFilter, setCityFilter] = useState("");
  const [provinceFilter, setProvinceFilter] = useState("");
  const [makeFilter, setMakeFilter] = useState("");
  const [yearFilter, setYearFilter] = useState("");
  const [mileageFilter, setMileageFilter] = useState("");
  const [transmissionFilter, setTransmissionFilter] = useState("");
  const [colorFilter, setColorFilter] = useState("");
  const [engineTypeFilter, setEngineTypeFilter] = useState("");
  const [engineCapacityFilter, setEngineCapacityFilter] = useState("");
  const [bodyTypeFilter, setBodyTypeFilter] = useState("");
  const [registeredInFilter, setRegisteredInFilter] = useState("");
  const [favorited, setFavorited] = useState<Set<number>>(new Set());
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({
    search: true,
    make: true,
    province: false,
    city: false,
    price: true,
    year: false,
    mileage: false,
    registeredIn: false,
    transmission: false,
    color: false,
    engineType: false,
    engineCapacity: false,
    bodyType: false,
  });

  const CITY_LIST = ["Lahore", "Karachi", "Islamabad", "Rawalpindi"];
  const MAKE_LIST = ["Toyota", "Honda", "Suzuki", "Kia", "BMW"];
  const PROVINCE_LIST = ["Punjab", "Sindh", "KPK", "Balochistan", "GB"];
  const TRANSMISSION_LIST = ["Manual", "Automatic"];
  const COLOR_LIST = ["White", "Black", "Silver", "Gray", "Red", "Blue", "Green", "Beige"];
  const ENGINE_TYPE_LIST = ["Petrol", "Diesel", "Hybrid", "Electric"];
  const ENGINE_CAPACITY_LIST = ["1000-1500", "1500-2000", "2000-2500", "2500+"];
  const BODY_TYPE_LIST = ["Sedan", "SUV", "Hatchback", "Wagon", "Van", "Coupe", "Truck"];
  const REGISTERED_IN_LIST = ["Pakistan", "Import", "Other"];

  const PRICE_RANGES = [
    { label: "Below 1M", value: "0-1000000" },
    { label: "1M - 2M", value: "1000000-2000000" },
    { label: "2M - 5M", value: "2000000-5000000" },
    { label: "Above 5M", value: "5000000+" },
  ];

  const YEAR_RANGES = [
    { label: "2020 & Earlier", value: "0-2020" },
    { label: "2021-2022", value: "2021-2022" },
    { label: "2023-2024", value: "2023-2024" },
    { label: "2025+", value: "2025-3000" },
  ];

  const MILEAGE_RANGES = [
    { label: "Below 50K", value: "0-50000" },
    { label: "50K-100K", value: "50000-100000" },
    { label: "100K-150K", value: "100000-150000" },
    { label: "Above 150K", value: "150000+" },
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
        const favoriteCars = await getFavoriteCars();
        const favoriteIds = new Set<number>(
          Array.isArray(favoriteCars) 
            ? favoriteCars.map((car: any) => car.id as number) 
            : ((favoriteCars as any)?.data || []).map((car: any) => car.id as number)
        );
        setFavorited(favoriteIds);
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

  const filterCars = (
    searchValue: string,
    priceValue: string,
    cityValue: string,
    provinceValue: string,
    makeValue: string,
    yearValue: string,
    mileageValue: string,
    transmissionValue: string,
    colorValue: string,
    engineTypeValue: string,
    engineCapacityValue: string,
    bodyTypeValue: string,
    registeredInValue: string
  ) => {
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

    if (cityValue) {
      filtered = filtered.filter((car) => {
        const carCity = typeof car.city === "string" ? car.city : car.city?.name || "";
        return carCity.toLowerCase() === cityValue.toLowerCase();
      });
    }

    if (provinceValue) {
      filtered = filtered.filter((car) => {
        const carProvince = typeof car.province === "string" ? car.province : car.province?.name || "";
        return carProvince.toLowerCase() === provinceValue.toLowerCase();
      });
    }

    if (makeValue) {
      filtered = filtered.filter((car) => {
        const carMake = typeof car.make === "string" ? car.make : car.make?.name || "";
        return carMake.toLowerCase() === makeValue.toLowerCase();
      });
    }

    if (yearValue) {
      const [minYear, maxYear] = yearValue.includes("+")
        ? [parseInt(yearValue), 3000]
        : yearValue.split("-").map(Number);
      filtered = filtered.filter((car) => {
        const carYear = car.year || 0;
        return carYear >= minYear && carYear <= maxYear;
      });
    }

    if (mileageValue) {
      const [minMileage, maxMileage] = mileageValue.includes("+")
        ? [parseInt(mileageValue), Infinity]
        : mileageValue.split("-").map(Number);
      filtered = filtered.filter((car) => car.mileage >= minMileage && car.mileage <= maxMileage);
    }

    if (transmissionValue) {
      filtered = filtered.filter((car) => {
        const carTransmission = typeof car.transmission === "string" ? car.transmission : car.transmission?.name || "";
        return carTransmission.toLowerCase() === transmissionValue.toLowerCase();
      });
    }

    if (colorValue) {
      filtered = filtered.filter((car) => {
        const carColor = typeof car.color === "string" ? car.color : car.color?.name || "";
        return carColor.toLowerCase() === colorValue.toLowerCase();
      });
    }

    if (engineTypeValue) {
      filtered = filtered.filter((car) => {
        const carEngineType = typeof car.engineType === "string" ? car.engineType : car.engineType?.name || "";
        return carEngineType.toLowerCase() === engineTypeValue.toLowerCase();
      });
    }

    if (engineCapacityValue) {
      const [min, max] = engineCapacityValue.includes("+")
        ? [parseInt(engineCapacityValue), Infinity]
        : engineCapacityValue.split("-").map(Number);
      filtered = filtered.filter((car) => {
        const capacity = car.engine_capacity || 0;
        return capacity >= min && capacity <= max;
      });
    }

    if (bodyTypeValue) {
      filtered = filtered.filter((car) => {
        const carBodyType = typeof car.bodyType === "string" ? car.bodyType : car.bodyType?.name || "";
        return carBodyType.toLowerCase() === bodyTypeValue.toLowerCase();
      });
    }

    if (registeredInValue) {
      filtered = filtered.filter((car) => {
        const carRegisteredIn = car.registered_in || "";
        return carRegisteredIn.toLowerCase() === registeredInValue.toLowerCase();
      });
    }

    setFilteredCars(filtered);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    filterCars(value, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handlePriceChange = (value: string) => {
    setPriceFilter(value);
    filterCars(searchTerm, value, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleCityChange = (value: string) => {
    setCityFilter(value);
    filterCars(searchTerm, priceFilter, value, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleProvinceChange = (value: string) => {
    setProvinceFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, value, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleMakeChange = (value: string) => {
    setMakeFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, value, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleYearChange = (value: string) => {
    setYearFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, value, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleMileageChange = (value: string) => {
    setMileageFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, value, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleTransmissionChange = (value: string) => {
    setTransmissionFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, value, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleColorChange = (value: string) => {
    setColorFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, value, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleEngineTypeChange = (value: string) => {
    setEngineTypeFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, value, engineCapacityFilter, bodyTypeFilter, registeredInFilter);
  };

  const handleEngineCapacityChange = (value: string) => {
    setEngineCapacityFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, value, bodyTypeFilter, registeredInFilter);
  };

  const handleBodyTypeChange = (value: string) => {
    setBodyTypeFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, value, registeredInFilter);
  };

  const handleRegisteredInChange = (value: string) => {
    setRegisteredInFilter(value);
    filterCars(searchTerm, priceFilter, cityFilter, provinceFilter, makeFilter, yearFilter, mileageFilter, transmissionFilter, colorFilter, engineTypeFilter, engineCapacityFilter, bodyTypeFilter, value);
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
    setCityFilter("");
    setProvinceFilter("");
    setMakeFilter("");
    setYearFilter("");
    setMileageFilter("");
    setTransmissionFilter("");
    setColorFilter("");
    setEngineTypeFilter("");
    setEngineCapacityFilter("");
    setBodyTypeFilter("");
    setRegisteredInFilter("");
    setFilteredCars(cars);
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      <Navbar />

      <section className="py-10 px-6 md:px-16 bg-gradient-to-b from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto flex gap-8 mt-16">

          {/* ================= FILTER SIDEBAR ================= */}
          <aside className="w-72 bg-white p-6 rounded-2xl shadow-sm h-fit sticky top-24 overflow-y-auto max-h-[calc(100vh-120px)]">
            <h3 className="text-lg font-semibold mb-6">Filter Cars</h3>

            {/* SEARCH */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("search")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Search</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.search ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.search && (
                <div className="mt-2">
                  <input
                    type="text"
                    placeholder="Search by make, model, city"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm
                               focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>
              )}
            </div>

            {/* MAKE */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("make")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Make</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.make ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.make && (
                <div className="mt-2">
                  <select
                    value={makeFilter}
                    onChange={(e) => handleMakeChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">All Makes</option>
                    {MAKE_LIST.map((make) => (
                      <option key={make} value={make}>
                        {make}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* PROVINCE */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("province")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Province</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.province ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.province && (
                <div className="mt-2">
                  <select
                    value={provinceFilter}
                    onChange={(e) => handleProvinceChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">All Provinces</option>
                    {PROVINCE_LIST.map((province) => (
                      <option key={province} value={province}>
                        {province}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* CITY */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("city")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">City</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.city ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.city && (
                <div className="mt-2">
                  <select
                    value={cityFilter}
                    onChange={(e) => handleCityChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">All Cities</option>
                    {CITY_LIST.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* PRICE RANGE */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("price")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Price Range</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.price ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.price && (
                <div className="mt-2">
                  <select
                    value={priceFilter}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
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
              )}
            </div>

            {/* YEAR */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("year")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Year</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.year ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.year && (
                <div className="mt-2">
                  <select
                    value={yearFilter}
                    onChange={(e) => handleYearChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Year</option>
                    {YEAR_RANGES.map((y) => (
                      <option key={y.value} value={y.value}>
                        {y.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* MILEAGE */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("mileage")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Mileage (Km)</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.mileage ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.mileage && (
                <div className="mt-2">
                  <select
                    value={mileageFilter}
                    onChange={(e) => handleMileageChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Mileage</option>
                    {MILEAGE_RANGES.map((m) => (
                      <option key={m.value} value={m.value}>
                        {m.label}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* REGISTERED IN */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("registeredIn")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Registered In</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.registeredIn ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.registeredIn && (
                <div className="mt-2">
                  <select
                    value={registeredInFilter}
                    onChange={(e) => handleRegisteredInChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Registration</option>
                    {REGISTERED_IN_LIST.map((reg) => (
                      <option key={reg} value={reg}>
                        {reg}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* TRANSMISSION */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("transmission")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Transmission</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.transmission ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.transmission && (
                <div className="mt-2">
                  <select
                    value={transmissionFilter}
                    onChange={(e) => handleTransmissionChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Transmission</option>
                    {TRANSMISSION_LIST.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* COLOR */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("color")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Color</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.color ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.color && (
                <div className="mt-2">
                  <select
                    value={colorFilter}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Color</option>
                    {COLOR_LIST.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* ENGINE TYPE */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("engineType")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Engine Type</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.engineType ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.engineType && (
                <div className="mt-2">
                  <select
                    value={engineTypeFilter}
                    onChange={(e) => handleEngineTypeChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Engine Type</option>
                    {ENGINE_TYPE_LIST.map((e) => (
                      <option key={e} value={e}>
                        {e}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* ENGINE CAPACITY */}
            <div className="mb-4">
              <button
                onClick={() => toggleSection("engineCapacity")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Engine Capacity (cc)</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.engineCapacity ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.engineCapacity && (
                <div className="mt-2">
                  <select
                    value={engineCapacityFilter}
                    onChange={(e) => handleEngineCapacityChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Capacity</option>
                    {ENGINE_CAPACITY_LIST.map((ec) => (
                      <option key={ec} value={ec}>
                        {ec} cc
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* BODY TYPE */}
            <div className="mb-6">
              <button
                onClick={() => toggleSection("bodyType")}
                className="w-full flex items-center justify-between py-2 px-3 hover:bg-gray-50 rounded-lg transition"
              >
                <span className="text-sm font-semibold text-gray-700">Body Type</span>
                <ChevronDown
                  size={18}
                  className={`transform transition-transform ${expandedSections.bodyType ? "rotate-180" : ""}`}
                />
              </button>
              {expandedSections.bodyType && (
                <div className="mt-2">
                  <select
                    value={bodyTypeFilter}
                    onChange={(e) => handleBodyTypeChange(e.target.value)}
                    className="w-full border rounded-xl px-4 py-2 text-sm 
                               focus:ring-2 focus:ring-blue-500 transition"
                  >
                    <option value="">Any Body Type</option>
                    {BODY_TYPE_LIST.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <button
              onClick={clearFilters}
              className="w-full py-2 rounded-xl text-sm font-medium
                         border hover:bg-gray-100 transition"
            >
              Clear All Filters
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
