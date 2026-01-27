"use client";

import { createSellCar } from "@/src/services/sellCar.service";
import { uploadSellCarImage } from "@/src/services/sellCarMedia.service";
import { getPublicMakes, getPublicModels, getPublicVersions, getPublicProvinces, getPublicCities, getPublicEngineTypes, getPublicTransmissions, getPublicFeatures } from "@/src/services/admin.lookup.service";
import { getUserProfile } from "@/src/services/user.service";
import { Make, CarModel, Version, Province, City, Feature } from "@/src/types/lookups";
import { useEffect, useRef, useState } from "react";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import logo from "@/src/assets/images/logo.svg";
import Image from "next/image";

interface CarInfo {
  year: number | null;
  make_id: number | null;
  make_name: string;
  model_id: number | null;
  model_name: string;
  version_id: number | null;
  version_name: string;
}

interface SellCarPayload {
  version_id: number | null;
  make_id: number | null;
  seller_city_id: number | null;
  registered_city: string | null;
  registered_province: string;
  mileage: number;
  price: number;
  engine_type_id: number;
  engine?: string;
  capacity?: number;
  transmission_id: number;
  assembly_type: string;
  seller_name: string | null;
  seller_phone: string | null;
  secondary_phone: string | null;
  whatsapp_allowed: boolean;
  description: string | null;
  features?: number[];
}



import { 
  MapPin, 
  Car, 
  Info, 
  Image as ImageIcon, 
  User, 
  ShieldCheck,
  Upload,
  CheckCircle,
  ChevronRight,
} from "lucide-react";

/* Dummy Data */
const YEARS = [2026, 2025,2024, 2023, 2022, 2021, 2020];


export default function AddCarPage() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [showCarPopup, setShowCarPopup] = useState(false);
  const [step, setStep] = useState<number>(1);
  const imageInputRef = useRef<HTMLInputElement>(null);

  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userData, setUserData] = useState<{ id: number; name: string; email: string } | null>(null);

  // Lookup data states
  const [makes, setMakes] = useState<Make[]>([]);
  const [models, setModels] = useState<CarModel[]>([]);
  const [versions, setVersions] = useState<Version[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [engineTypes, setEngineTypes] = useState<{ id: number; name: string }[]>([]);
  const [transmissions, setTransmissions] = useState<{ id: number; name: string }[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);

  const [isLoadingMakes, setIsLoadingMakes] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const [isLoadingVersions, setIsLoadingVersions] = useState(false);

  const [carInfo, setCarInfo] = useState<CarInfo>({
    year: null,
    make_id: null,
    make_name: "",
    model_id: null,
    model_name: "",
    version_id: null,
    version_name: "",
  });

  const STORAGE_KEY = "sellCarFormData";
  const STORAGE_IMAGES_KEY = "sellCarImages";

  // Check authentication on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Load from local storage if not authenticated
    if (!token) {
      loadFormDataFromStorage();
    } else {
      // Fetch user data if authenticated
      fetchUserData();
    }
  }, []);

  const fetchUserData = async () => {
    try {
      const user = await getUserProfile();
      setUserData(user);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };


/* ===================== LOCAL STORAGE FUNCTIONS ===================== */
  const saveFormDataToStorage = (formData: any) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving to local storage:", error);
    }
  };

  const loadFormDataFromStorage = () => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const data = JSON.parse(savedData);
        setCarInfo(data.carInfo || carInfo);
        setSelectedFeatures(data.selectedFeatures || []);
      }
    } catch (error) {
      console.error("Error loading from local storage:", error);
    }
  };

  const clearFormDataFromStorage = () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_IMAGES_KEY);
    } catch (error) {
      console.error("Error clearing local storage:", error);
    }
  };

/* ===================== FETCH API ===================== */
  const fetchMakes = async () => {
    setIsLoadingMakes(true);
    try {
      console.log("Fetching makes...");
      const data = await getPublicMakes();
      console.log("Makes data:", data);
      setMakes(data || []);
    } catch (error) {
      console.error('Error fetching makes:', error);
      setMakes([]);
    } finally {
      setIsLoadingMakes(false);
    }
  };

  const fetchModels = async (makeId: number) => {
    setIsLoadingModels(true);
    try {
      const data = await getPublicModels(makeId);
      setModels(data);
    } catch (error) {
      console.error('Error fetching models:', error);
      setModels([]);
    } finally {
      setIsLoadingModels(false);
    }
  };

  const fetchVersions = async (modelId: number) => {
    setIsLoadingVersions(true);
    try {
      const data = await getPublicVersions(modelId);
      setVersions(data);
    } catch (error) {
      console.error('Error fetching versions:', error);
      setVersions([]);
    } finally {
      setIsLoadingVersions(false);
    }
  };

  const fetchAllData = async () => {
    try {
      const [provincesData, citiesData, engineTypesData, transmissionsData, featuresData] = await Promise.all([
        getPublicProvinces(),
        getPublicCities(),
        getPublicEngineTypes(),
        getPublicTransmissions(),
        getPublicFeatures(),
      ]);
      setProvinces(provincesData);
      setCities(citiesData);
      setEngineTypes(engineTypesData);
      setTransmissions(transmissionsData);
      setFeatures(featuresData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchMakes();
    fetchAllData();
  }, []);

  const openCarModal = () => {
    setShowCarPopup(true);
    setStep(1);
    setCurrentStep(1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setImages(Array.from(e.target.files));
  };

  const resetCarInfo = (): void => {
    setCarInfo({
      year: null,
      make_id: null,
      make_name: "",
      model_id: null,
      model_name: "",
      version_id: null,
      version_name: "",
    });
    setStep(1);
  };





const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const form = e.currentTarget;
      const formData = new FormData(form);

      // Validate required fields
      if (!carInfo.version_id || !carInfo.make_id) {
        alert("Please select car information");
        setLoading(false);
        return;
      }

      if (!formData.get("seller_name") || !formData.get("seller_phone")) {
        alert("Please fill in seller information");
        setLoading(false);
        return;
      }

      if (images.length === 0) {
        alert("Please upload at least one image");
        setLoading(false);
        return;
      }

      // Validate mileage and price are numbers
      const mileage = Number(formData.get("mileage"));
      const price = Number(formData.get("price"));
      
      if (isNaN(mileage) || mileage < 0) {
        alert("Please enter a valid mileage");
        setLoading(false);
        return;
      }

      if (isNaN(price) || price < 0) {
        alert("Please enter a valid price");
        setLoading(false);
        return;
      }

      const payload: SellCarPayload = {
        version_id: carInfo.version_id,
        make_id: carInfo.make_id,
        seller_city_id: Number(formData.get("seller_city_id")) || null,
        registered_city: (formData.get("registered_city") as string) || "",
        registered_province: (formData.get("registered_province") as string) || "",
        mileage: Number(formData.get("mileage")) || 0,
        price: Number(formData.get("price")) || 0,
        engine_type_id: Number(formData.get("engine_type_id")) || 0,
        engine: (formData.get("engine") as string) || undefined,
        capacity: formData.get("capacity") ? Number(formData.get("capacity")) : undefined,
        transmission_id: Number(formData.get("transmission_id")) || 0,
        assembly_type: (formData.get("assembly_type") as string) || "Local",
        seller_name: (formData.get("seller_name") as string) || "",
        seller_phone: (formData.get("seller_phone") as string) || "",
        secondary_phone: (formData.get("secondary_phone") as string) || null,
        whatsapp_allowed: formData.get("whatsapp_allowed") === "on",
        description: (formData.get("description") as string) || null,
        features: selectedFeatures.length > 0 ? selectedFeatures : undefined,
      };

      // Step 1: Create sell car
      const response = await createSellCar(payload);
      const sellCarId = response?.data?.id || response?.id;

      if (!sellCarId) {
        alert("Failed to create car listing");
        setLoading(false);
        return;
      }

      // Step 2: Upload images using SellCarMediaController
      let uploadedCount = 0;
      let uploadErrors: string[] = [];
      
      for (const file of images) {
        try {
          await uploadSellCarImage(sellCarId, file);
          uploadedCount++;
        } catch (imageErr: any) {
          console.error(`Failed to upload image:`, imageErr);
          const errorMsg = imageErr?.response?.data?.message || imageErr?.message || "Unknown error";
          uploadErrors.push(`${file.name}: ${errorMsg}`);
        }
      }

      if (uploadedCount === 0 && uploadErrors.length > 0) {
        alert(`Failed to upload images:\n${uploadErrors.join('\n')}`);
        setLoading(false);
        return;
      }

      alert(`Car listed successfully!  Uploaded ${uploadedCount}/${images.length} image(s)${uploadErrors.length > 0 ? '\nFailed: ' + uploadErrors.join(', ') : ''}`);
      form.reset();
      setImages([]);
      resetCarInfo();
      setSelectedFeatures([]);
      clearFormDataFromStorage();
      setCurrentStep(1);
    } catch (err: any) {
      console.error("Submission error:", err);
      alert(err?.response?.data?.message || "Failed to create car listing");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Enter Car Info", icon: Car },
    { number: 2, label: "Upload Photos", icon: ImageIcon },
    { number: 3, label: "Your Info", icon: CheckCircle },
  ];

  return (
    <>
    <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
        <div className="max-w-7xl mx-auto mt-16">
            {/* Hero Section */}
            <div className="flex justify-center ">
                <div className="bg-white shadow-lg rounded-2xl mb-3 p-8 w-full max-w-full">
                    <div className="text-center mb-2">
                        <h1 className="text-4xl md:text-5xl font-semibold  text-blue-800 mb-4">
                            Sell Your Car With 3 Easy & Simple Steps!
                        </h1>
                        <p className="text-lg text-gray-600 mb-6">
                            It&apos;s free and takes less than a minute
                        </p>
                    
                    {/* Steps Progress */}
                    <div className="flex justify-center items-center mb-6">
                        {steps.map((s, index) => (
                        <div key={s.number} className="flex items-center">
                            <div className="flex flex-col items-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 mb-2 ${
                                currentStep >= s.number 
                                ? 'bg-blue-600 border-blue-600 text-white' 
                                : 'border-gray-300 text-gray-400'
                            }`}>
                                <s.icon className="w-6 h-6" />
                            </div>
                            <span className="text-sm font-medium font-bold text-gray-700">{s.label}</span>
                            </div>
                            {index < steps.length - 1 && (
                            <div className="w-24 h-1 mx-4 bg-gray-300" />
                            )}
                        </div>
                        ))}
                    </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-10">
            {/* Left Sticky Sidebar */}
            <div className="lg:col-span-1">
                <div className="sticky top-24 bg-white  rounded-2xl shadow-lg p-8">
                
                

                <div className="text-center mb-8  bg-gradient-to-br from-blue-100 to-blue-50">
                    <div className="w-70 h-64 mx-auto mb-3  flex flex-col items-center justify-center p-4  transition">
                        {/* Logo */}
                        <Image
                            src={logo.src} 
                            alt="Logo"
                            width={130}
                            height={130}
                            className="object-contain  border p-2 rounded-lg mb-6 hover:shadow-md transition"
                        />

                        {/* Text */}
                        <div className="text-center">
                            <h2 className="text-lg md:text-xl font-bold text-blue-700">
                            Fast & Easy To Sell Your Car
                            </h2>
                            {/* <p className="text-sm text-blue-700 mt-1">
                            List your car in minutes and reach buyers instantly
                            </p> */}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                    Sell your car fast
                    </h2>
                    <p className="text-gray-600 mb-6">
                    Get the best price for your car. Our platform connects you with serious buyers instantly.
                    Complete your listing in just a few minutes!
                    </p>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Verified Buyers Only</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">No Hidden Fees</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                    <Upload className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Easy Photo Upload</span>
                    </div>
                </div>
                </div>
            </div>

            {/* Right Scrollable Form */}
            <div className="lg:col-span-2">
                <form onSubmit={handleSubmit} className="space-y-8">



                    
                {/* Card 1: Car Information */}
                <div className="bg-white rounded-2xl mb-3 shadow-sm p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg  bg-blue-100 flex items-center justify-center">
                        <Car className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Car Information</h3>
                        <p className="text-sm text-gray-500">Select your car details</p>
                    </div>
                    </div>

                    <button
                    type="button"
                    onClick={() => openCarModal()}
                    className="w-full border-2 border-dashed border-gray-300 rounded-xl p-6 text-left hover:border-blue-600 hover:bg-blue-50 transition-colors"
                    >
                    {carInfo.make_id  ? (
                        <div>
                        <div className="text-xs text-gray-500 mb-2">Selected Car</div>
                        <div className="text-xl font-semibold text-gray-900">
                           {carInfo.year} {carInfo.make_name} {carInfo.model_name}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">Version: {carInfo.version_name}</div>
                        </div>
                    ) : (
                        <div className="text-center py-4">
                        <div className="text-gray-400 mb-2">Click to select car</div>
                        <div className="text-sm text-gray-500">
                            Select Year, Make, Model & Version
                        </div>
                        </div>
                    )}
                    </button>

                    {/* Hidden inputs for backend */}
                    <input type="hidden" name="year" value={carInfo.year ?? ""} />

                    <input type="hidden" name="make_id" value={carInfo.make_id ?? ""} />
                    <input type="hidden" name="model_id" value={carInfo.model_id ?? ""} />
                    <input type="hidden" name="version_id" value={carInfo.version_id ?? ""} />

                </div>

                {/* Card 2: Location */}
                <div className="bg-white rounded-2xl mb-3 shadow-sm p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <MapPin className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Location</h3>
                        <p className="text-sm text-gray-500">Where is your car located?</p>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-3">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration Province *</label>
                        <select 
                        name="registered_province" 
                        required 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Select Province</option>
                          {provinces.map(p => (
                            <option key={p.id} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Registration City *</label>
                        <select 
                        name="registered_city" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Select City</option>
                          {cities.map(c => (
                            <option key={c.id} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                    </div>
                    </div>
                    
                    <div className="grid md:grid-cols-1 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Seller City *</label>
                        <select 
                        name="seller_city_id" 
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">Select City</option>
                          {cities.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                    </div>
                    </div>
                </div>

                {/* Card 3: Details */}
                <div className="bg-white rounded-2xl mb-3 shadow-sm p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <Info className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Car Details</h3>
                        <p className="text-sm text-gray-500">Additional information about your car</p>
                    </div>
                    </div>


                    <div className="grid md:grid-cols-2 gap-4">
                    
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Mileage (km) *</label>
                            <input 
                            name="mileage" 
                            type="number"
                            required 
                            placeholder="Mileage in kilometers" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Price (PKR) *</label>
                            <input 
                            name="price" 
                            type="number"
                            required 
                            placeholder="Price" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                    
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Engine Type *</label>
                            <select 
                            name="engine_type_id" 
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Select Engine Type</option>
                              {engineTypes.map(et => (
                                <option key={et.id} value={et.id}>{et.name}</option>
                              ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Transmission *</label>
                            <select 
                            name="transmission_id"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                              <option value="">Select Transmission</option>
                              {transmissions.map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                              ))}
                            </select>
                        </div>

                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Assembly Type *</label>
                            <select
                            name="assembly_type"
                            required
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            >
                                <option value="">Select Assembly Type</option>
                                <option value="Local">Local</option>
                                <option value="Imported">Imported</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Engine Capacity (CC)</label>
                            <input 
                            name="capacity"
                            type="number" 
                            placeholder="e.g., 1500" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                    </div>



                    <div className="grid md:grid-cols-1 gap-4 mt-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Features</label>
                            <div className="border border-gray-300 rounded-lg p-4 max-h-48 overflow-y-auto">
                              {features.map(f => (
                                <label key={f.id} className="flex items-center gap-2 mb-2 cursor-pointer">
                                  <input 
                                    type="checkbox"
                                    value={f.id}
                                    checked={selectedFeatures.includes(f.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedFeatures([...selectedFeatures, f.id]);
                                      } else {
                                        setSelectedFeatures(selectedFeatures.filter(id => id !== f.id));
                                      }
                                    }}
                                    className="w-4 h-4"
                                  />
                                  <span className="text-sm text-gray-700">{f.name}</span>
                                </label>
                              ))}
                            </div>
                        </div>
                    </div>

                    <input type="hidden" name="registered_province" value="Punjab" />

                    <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Describe your car's condition, features, maintenance history, etc."
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-none"
                    />
                    </div>
                </div>

                {/* Card 4: Photos */}
                <div className="bg-white rounded-2xl mb-3 shadow-sm p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <ImageIcon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Photos</h3>
                        <p className="text-sm text-gray-500">Upload clear photos of your car</p>
                    </div>
                    </div>

                    <div 
                    className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-600 hover:bg-blue-50 transition-colors cursor-pointer"
                   onClick={() => imageInputRef.current?.click()}
                    onMouseEnter={() => setCurrentStep(2)}
                    >
                    <ImageIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <div className="text-gray-600 font-medium mb-2">Click to upload photos</div>
                    <p className="text-sm text-gray-500">Recommended: 6-12 clear photos</p>
                    <input 
                        ref={imageInputRef}
                        id="image-upload"
                        type="file" 
                        multiple 
                        name="images[]"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    </div>

                    {images.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
                        {images.map((img, i) => (
                        <div key={i} className="relative group">
                            <img
                            src={URL.createObjectURL(img)}
                            className="h-40 w-full object-cover rounded-lg"
                            alt={`Car photo ${i + 1}`}
                            />
                            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-50 transition-all rounded-lg flex items-center justify-center">
                            <button
                                type="button"
                                onClick={() => setImages(images.filter((_, index) => index !== i))}
                                className="opacity-0 group-hover:opacity-100 text-white text-sm bg-red-500 px-3 py-1 rounded-lg transition-opacity"
                            >
                                Remove
                            </button>
                            </div>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                {/* Card 5: Seller Info */}
                <div className="bg-white rounded-2xl mb-3 shadow-sm p-6 hover:shadow-lg transition-all">
                    <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold text-gray-900">Seller Information</h3>
                        <p className="text-sm text-gray-500">Contact details for buyers</p>
                    </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input 
                        name="seller_name" 
                        required
                        placeholder="John Doe" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input 
                        name="seller_phone" 
                        required
                        placeholder="(123) 456-7890" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Secondary Phone</label>
                        <input 
                        name="secondary_phone" 
                        placeholder="Optional secondary phone" 
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        />
                    </div>
                    <div>
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                        <input 
                            type="checkbox"
                            name="whatsapp_allowed"
                            className="w-4 h-4"
                        />
                        Allow WhatsApp Contact
                        </label>
                    </div>
                    </div>

                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-blue-600 active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                    {loading ? (
                    <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Submitting...
                    </>
                    ) : (
                    <>
                        {isAuthenticated ? 'Publish Your Listing' : 'Publish Now'}
                        <ChevronRight className="w-5 h-5" />
                    </>
                    )}
                </button>
                </form>
            </div>
            </div>
        </div>

        </div>
        
{/* ===== Car Selection Modal ===== */}
{showCarPopup && (
  <div className="car-modal-overlay">
    <div className="car-modal-content">
      {/* Header */}
      <div className="flex justify-between items-center border-b border-gray-200 p-6">
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">
            Select Car Information
          </h3>
          <p className="text-sm text-gray-500">
            Step {step} of 4 • {step === 1 ? "Year" : step === 2 ? "Make" : step === 3 ? "Model" : "Version"}
          </p>
        </div>
        <button
          onClick={() => setShowCarPopup(false)}
          className="w-10 h-10 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Body */}
      <div className="car-modal-body p-6">
        {step === 1 && (
          <StepGrid
            title="Select Model Year"
            subtitle="Choose the manufacturing year of your car"
            data={YEARS}
           onSelect={(v: number) => {
  setCarInfo({
    year: v,
    make_id: null,
    make_name: "",
    model_id: null,
    model_name: "",
    version_id: null,
    version_name: "",
  });
  setStep(2);
}}


          />
        )}
         {step === 2 && (
                <StepGrid
                  title="Select Make"
                  subtitle="Choose the brand of your car"
                  data={makes}
                  onBack={() => setStep(1)}
                  onSelect={async (make: Make) => {
                    setCarInfo(prev => ({ ...prev, make_id: make.id, make_name: make.name, model_id: null, model_name: "", version_id: null, version_name: "" }));
                    setIsLoadingModels(true);
                    const modelData = await getPublicModels(make.id);
                    setModels(modelData);
                    setIsLoadingModels(false);
                    setStep(3);
                  }}
                />
              )}

{step === 3 && (
  isLoadingModels ? (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-600">Loading models...</span>
    </div>
  ) : (
    <StepGrid
      title="Select Model"
      subtitle="Choose your car model"
      data={models}
      onBack={() => setStep(2)}
      onSelect={async (model: CarModel) => {
        setCarInfo((prev) => ({
          ...prev,
          model_id: model.id,
          model_name: model.name,
          version_id: null,
          version_name: "",
          
        }));
        setIsLoadingVersions(true);
        const versionData = await getPublicVersions(model.id);
        setVersions(versionData);
        setIsLoadingVersions(false);
        setStep(4);
      }}
    />
  )
)}

{step === 4 && (
  isLoadingVersions ? (
    <div className="flex items-center justify-center py-8">
      <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      <span className="ml-3 text-gray-600">Loading versions...</span>
    </div>
  ) : (
    <StepGrid
      title="Select Version"
      subtitle="Choose your car version"
      data={versions}
      onBack={() => setStep(3)}
      onSelect={(version: Version) => {
        setCarInfo((prev) => ({
          ...prev,
          version_id: version.id,
          version_name: version.name,
          year: version.year,
        }));
        setShowCarPopup(false);
      }}
    />
  )
)}

      </div>

      {/* Footer Back Button */}
      {step > 1 && (
        <div className="border-t border-gray-200 p-6">
          <button
            onClick={() => setStep(step - 1)}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            ← Back
          </button>
        </div>
      )}
    </div>
  </div>
)}

    <Footer />
    </>
  );
}
/* ===== Step Grid Component ===== */
interface StepGridProps<T extends string | number> {
  title: string;
  subtitle?: string;
  data: T[];
  onSelect: (value: T) => void;
  onBack?: () => void;
}

function StepGrid<T extends string | number>({ title, subtitle, data, onSelect }: StepGridProps<T>) {
  return (
    <>
      <div className="mb-6">
        <h4 className="text-2xl font-semibold text-gray-900 mb-1">{title}</h4>
        {subtitle && <p className="text-gray-600 text-sm">{subtitle}</p>}
      </div>

      <div className="flex flex-col space-y-3 overflow-y-auto max-h-[60vh] pr-2">
        {Array.isArray(data) && data.map((item: any) => {
          const displayText = typeof item === 'object' && item !== null && 'name' in item ? item.name : String(item);
          return (
            <button
              key={String(item.id ?? item)}
              onClick={() => onSelect(item)}
              className="w-full border-2 border-gray-200 rounded-xl p-4 text-left hover:border-blue-600 hover:bg-blue-50 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="text-lg font-medium text-gray-900 hover:text-blue-600 transition-colors">
                {displayText}
              </div>
            </button>
          );
        })}
      </div>
    </>
  );
}