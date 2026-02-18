"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { submitManagedCar } from "@/src/services/managedCar.service";
import { uploadSellCarImage } from "@/src/services/sellCarMedia.service";
import {
    getPublicMakes,
    getPublicModels,
    getPublicVersions,
    getPublicProvinces,
    getPublicCities,
    getPublicEngineTypes,
    getPublicTransmissions,
    getPublicFeatures,
    getPublicColors,
    getPublicBodyTypes
} from "@/src/services/admin.lookup.service";
import { getUserProfile } from "@/src/services/user.service";
import { isUserAuthenticated } from "@/src/lib/auth/cookie.utils";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";
import {
    Handshake,
    Car,
    MapPin,
    Info,
    Image as ImageIcon,
    User,
    CheckCircle,
    ArrowRight,
    ShieldCheck,
    Zap,
    Upload,
    AlertCircle
} from "lucide-react";
import Image from "next/image";

export default function ManagedSellingPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Lookup Data
    const [makes, setMakes] = useState<any[]>([]);
    const [models, setModels] = useState<any[]>([]);
    const [versions, setVersions] = useState<any[]>([]);
    const [provinces, setProvinces] = useState<any[]>([]);
    const [cities, setCities] = useState<any[]>([]);
    const [colors, setColors] = useState<any[]>([]);
    const [bodyTypes, setBodyTypes] = useState<any[]>([]);
    const [engineTypes, setEngineTypes] = useState<any[]>([]);
    const [transmissions, setTransmissions] = useState<any[]>([]);
    const [features, setFeatures] = useState<any[]>([]);

    const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
    const [images, setImages] = useState<File[]>([]);
    const imageInputRef = useRef<HTMLInputElement>(null);

    const [carInfo, setCarInfo] = useState({
        make_id: "",
        model_id: "",
        version_id: "",
        year: new Date().getFullYear(),
    });

    const [formData, setFormData] = useState({
        mileage: "",
        price: "",
        color_id: "",
        body_type_id: "",
        engine_type_id: "",
        transmission_id: "",
        assembly_type: "Local",
        seller_city_id: "",
        registered_province: "",
        registered_city: "",
        description: "",
        seller_name: "",
        seller_phone: "",
        whatsapp_allowed: true,
    });

    useEffect(() => {
        const init = async () => {
            const auth = await isUserAuthenticated();
            setIsAuthenticated(auth);

            const [m, p, c, e, t, f, cl, bt] = await Promise.all([
                getPublicMakes(),
                getPublicProvinces(),
                getPublicCities(),
                getPublicEngineTypes(),
                getPublicTransmissions(),
                getPublicFeatures(),
                getPublicColors(),
                getPublicBodyTypes(),
            ]);

            setMakes(m);
            setProvinces(p);
            setCities(c);
            setEngineTypes(e);
            setTransmissions(t);
            setFeatures(f);
            setColors(cl);
            setBodyTypes(bt);

            if (auth) {
                const profile = await getUserProfile();
                if (profile) {
                    setFormData(prev => ({
                        ...prev,
                        seller_name: prev.seller_name || profile.name || "",
                        seller_phone: prev.seller_phone || profile.phone || "",
                    }));
                }
            }

            // Load from localStorage
            const savedData = localStorage.getItem("managed_selling_form");
            if (savedData) {
                try {
                    const parsed = JSON.parse(savedData);
                    setCarInfo(parsed.carInfo || carInfo);
                    setFormData(prev => ({ ...prev, ...parsed.formData }));
                    setSelectedFeatures(parsed.selectedFeatures || []);
                    setCurrentStep(parsed.currentStep || 1);

                    // Fetch models/versions if IDs exist
                    if (parsed.carInfo?.make_id) {
                        const modelData = await getPublicModels(parsed.carInfo.make_id);
                        setModels(modelData);
                        if (parsed.carInfo?.model_id) {
                            const versionData = await getPublicVersions(parsed.carInfo.model_id);
                            setVersions(versionData);
                        }
                    }
                } catch (e) {
                    console.error("Error loading saved form data", e);
                }
            }
        };
        init();
    }, []);

    // Save to localStorage whenever data changes
    useEffect(() => {
        const dataToSave = {
            carInfo,
            formData,
            selectedFeatures,
            currentStep
        };
        localStorage.setItem("managed_selling_form", JSON.stringify(dataToSave));
    }, [carInfo, formData, selectedFeatures, currentStep]);

    const handleMakeChange = async (e: any) => {
        const id = e.target.value;
        setCarInfo(prev => ({ ...prev, make_id: id, model_id: "", version_id: "" }));
        if (id) {
            const modelData = await getPublicModels(id);
            setModels(modelData);
        } else {
            setModels([]);
        }
    };

    const handleModelChange = async (e: any) => {
        const id = e.target.value;
        setCarInfo(prev => ({ ...prev, model_id: id, version_id: "" }));
        if (id) {
            const versionData = await getPublicVersions(id);
            setVersions(versionData);
        } else {
            setVersions([]);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setImages(Array.from(e.target.files));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isAuthenticated) {
            alert("Saving your progress. Please login to complete the submission.");
            router.push(`/auth/login?redirect=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        setLoading(true);
        try {
            const payload = {
                ...formData,
                ...carInfo,
                features: selectedFeatures,
            };

            const res: any = await submitManagedCar(payload);
            const sellCarId = res.sell_car?.id || res.id;

            if (images.length > 0 && sellCarId) {
                for (const file of images) {
                    await uploadSellCarImage(sellCarId, file);
                }
            }

            // Clear localStorage on success
            localStorage.removeItem("managed_selling_form");

            alert("Successfully submitted! Our team will contact you shortly for inspection.");
            router.push("/user/dashboard/cars/all");
        } catch (err: any) {
            console.error("Submission error:", err);
            alert(err?.response?.data?.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 3));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Navbar />

            <main className="flex-grow pt-24 pb-16 px-6">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="text-center mb-12 space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-bold text-sm">
                            <Handshake size={18} />
                            MANAGED SELLING SERVICE
                        </div>
                        <h1 className="text-4xl md:text-5xl font-black text-gray-900">
                            Let <span className="text-orange-600">Kaar4u</span> Sell Your Car
                        </h1>
                        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                            Professional inspection, verified buyers, and the best market price. Just give us the details, and we'll handle the rest.
                        </p>
                    </div>

                    {/* Stepper */}
                    <div className="flex justify-between items-center mb-12 relative px-4">
                        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-200 -z-10 -translate-y-1/2" />
                        {[
                            { step: 1, label: "Vehicle Info", icon: Car },
                            { step: 2, label: "Photos & Features", icon: ImageIcon },
                            { step: 3, label: "Contact Details", icon: User },
                        ].map((s) => (
                            <div key={s.step} className="flex flex-col items-center gap-2 bg-gray-50 px-4">
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm
                  ${currentStep >= s.step ? "bg-orange-600 text-white scale-110" : "bg-white text-gray-400 border border-gray-200"}`}
                                >
                                    <s.icon size={24} />
                                </div>
                                <span className={`text-sm font-bold ${currentStep >= s.step ? "text-orange-600" : "text-gray-400"}`}>
                                    {s.label}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Form Card */}
                    <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-100/50 p-8 md:p-12 border border-orange-50">
                        <form onSubmit={handleSubmit} className="space-y-8">

                            {/* Step 1: Vehicle Info */}
                            {currentStep === 1 && (
                                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Car Make</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={carInfo.make_id}
                                                onChange={handleMakeChange}
                                                required
                                            >
                                                <option value="">Select Make</option>
                                                {makes.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Model</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                disabled={!carInfo.make_id}
                                                value={carInfo.model_id}
                                                onChange={handleModelChange}
                                                required
                                            >
                                                <option value="">Select Model</option>
                                                {models.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Version/Variant</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                disabled={!carInfo.model_id}
                                                value={carInfo.version_id}
                                                onChange={(e) => setCarInfo(prev => ({ ...prev, version_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Version</option>
                                                {versions.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Registration Province</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.registered_province}
                                                onChange={(e) => setFormData(prev => ({ ...prev, registered_province: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Province</option>
                                                {provinces.map(p => <option key={p.id} value={p.name}>{p.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Registration City</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Lahore"
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.registered_city}
                                                onChange={e => setFormData(prev => ({ ...prev, registered_city: e.target.value }))}
                                                required
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Model Year</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={carInfo.year}
                                                onChange={(e) => setCarInfo(prev => ({ ...prev, year: Number(e.target.value) }))}
                                                required
                                            >
                                                {Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                    <option key={year} value={year}>{year}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Exterior Color</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.color_id}
                                                onChange={(e) => setFormData(prev => ({ ...prev, color_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Color</option>
                                                {colors.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Body Type</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.body_type_id}
                                                onChange={(e) => setFormData(prev => ({ ...prev, body_type_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Body Type</option>
                                                {bodyTypes.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Engine Type</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.engine_type_id}
                                                onChange={(e) => setFormData(prev => ({ ...prev, engine_type_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Engine</option>
                                                {engineTypes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Transmission</label>
                                            <select
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.transmission_id}
                                                onChange={(e) => setFormData(prev => ({ ...prev, transmission_id: e.target.value }))}
                                                required
                                            >
                                                <option value="">Select Transmission</option>
                                                {transmissions.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Mileage (km)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 50000"
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.mileage}
                                                onChange={e => setFormData(prev => ({ ...prev, mileage: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Expected Price (PKR)</label>
                                            <input
                                                type="number"
                                                placeholder="e.g. 3500000"
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.price}
                                                onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="w-full py-5 bg-orange-600 text-white rounded-2xl font-black text-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                                    >
                                        Continue to Photos
                                        <ArrowRight />
                                    </button>
                                </div>
                            )}

                            {/* Step 2: Photos & Features */}
                            {currentStep === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold flex items-center gap-2">
                                            <ImageIcon className="text-orange-600" />
                                            Upload Car Photos
                                        </h4>
                                        <div
                                            onClick={() => imageInputRef.current?.click()}
                                            className="border-4 border-dashed border-gray-100 rounded-[2rem] p-12 text-center hover:bg-orange-50/30 hover:border-orange-200 transition-all cursor-pointer group"
                                        >
                                            <input
                                                type="file"
                                                multiple
                                                hidden
                                                ref={imageInputRef}
                                                onChange={handleImageChange}
                                                accept="image/*"
                                            />
                                            <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                                                <Upload className="text-orange-600" size={32} />
                                            </div>
                                            <p className="text-lg font-bold text-gray-700">Click to upload photos</p>
                                            <p className="text-gray-500">Add interior, exterior, and engine photos for better valuation.</p>
                                            {images.length > 0 && (
                                                <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg font-bold">
                                                    <CheckCircle size={16} />
                                                    {images.length} photos selected
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="text-xl font-bold flex items-center gap-2">
                                            <Zap className="text-orange-600" />
                                            Notable Features
                                        </h4>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                            {features.slice(0, 12).map(f => (
                                                <button
                                                    key={f.id}
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedFeatures(prev =>
                                                            prev.includes(f.id) ? prev.filter(id => id !== f.id) : [...prev, f.id]
                                                        );
                                                    }}
                                                    className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all
                                    ${selectedFeatures.includes(f.id)
                                                            ? "bg-orange-600 border-orange-600 text-white shadow-md shadow-orange-100"
                                                            : "bg-white border-gray-100 text-gray-600 hover:border-orange-200"}`}
                                                >
                                                    {f.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="button"
                                            onClick={nextStep}
                                            className="flex-[2] py-5 bg-orange-600 text-white rounded-2xl font-black text-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all flex items-center justify-center gap-2"
                                        >
                                            Almost Done
                                            <ArrowRight />
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact Details */}
                            {currentStep === 3 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                                    <div className="bg-orange-50/50 p-6 rounded-3xl border border-orange-100 flex gap-4">
                                        <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                                            <ShieldCheck className="text-orange-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-900">Privacy Guaranteed</h4>
                                            <p className="text-sm text-gray-600">Your information is only used by Kaar4u experts to contact you about this sale.</p>
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Your Full Name</label>
                                            <input
                                                type="text"
                                                placeholder="e.g. Ali Khan"
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.seller_name}
                                                onChange={e => setFormData(prev => ({ ...prev, seller_name: e.target.value }))}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-bold text-gray-700 ml-1">Phone Number</label>
                                            <input
                                                type="tel"
                                                placeholder="e.g. 0300 1234567"
                                                className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                                value={formData.seller_phone}
                                                onChange={e => setFormData(prev => ({ ...prev, seller_phone: e.target.value }))}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">City for Inspection</label>
                                        <select
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none"
                                            value={formData.seller_city_id}
                                            onChange={e => setFormData(prev => ({ ...prev, seller_city_id: e.target.value }))}
                                            required
                                        >
                                            <option value="">Select City</option>
                                            {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Additional Details (Optional)</label>
                                        <textarea
                                            rows={4}
                                            placeholder="Tell us anything special about your car..."
                                            className="w-full px-5 py-4 rounded-2xl bg-gray-50 border-none ring-2 ring-gray-100 focus:ring-orange-500 transition-all outline-none resize-none"
                                            value={formData.description}
                                            onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                        />
                                    </div>

                                    <div className="flex gap-4">
                                        <button
                                            type="button"
                                            onClick={prevStep}
                                            className="flex-1 py-5 bg-gray-100 text-gray-700 rounded-2xl font-bold text-xl hover:bg-gray-200 transition-all"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-[2] py-5 bg-orange-600 text-white rounded-2xl font-black text-xl hover:bg-orange-700 shadow-lg shadow-orange-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                                        >
                                            {loading ? "Submitting..." : "Request Managed Selling"}
                                            {!loading && <CheckCircle />}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Why Kaar4u Managed? */}
                    <div className="mt-24 grid md:grid-cols-3 gap-8">
                        {[
                            { title: "Free Inspection", desc: "Expert team will visit and inspect your car at your doorstep.", icon: <ShieldCheck className="text-orange-600" /> },
                            { title: "Best Price", desc: "We ensure you get the maximum value with zero negotiation stress.", icon: <ArrowRight className="text-orange-600" /> },
                            { title: "Secure Payment", desc: "Fully secure transaction handled professionally by Kaar4u.", icon: <Zap className="text-orange-600" /> }
                        ].map((item, i) => (
                            <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center space-y-3">
                                <div className="w-16 h-16 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    {item.icon}
                                </div>
                                <h5 className="text-xl font-bold text-gray-900">{item.title}</h5>
                                <p className="text-gray-500 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
