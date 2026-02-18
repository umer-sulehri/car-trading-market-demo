"use client";

import { FC, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { MapPin, Gauge, Heart, Star, ShieldCheck, User, Settings, Zap } from "lucide-react";
import { getImageUrl } from "@/src/utils/imageUtils";
import { assets } from "@/src/assets/js/assets";
import { toggleFavorite as toggleFavoriteAPI, checkIfFavorited } from "@/src/services/favorite.service";
import { ArrowRight } from "lucide-react";

import { isUserAuthenticated } from "@/src/lib/auth/cookie.utils";

interface CarCardProps {
    car: any;
}

const CarCard: FC<CarCardProps> = ({ car }) => {
    const router = useRouter();
    const [isFav, setIsFav] = useState(false);
    const [loadingFav, setLoadingFav] = useState(false);

    useEffect(() => {
        const checkFav = async () => {
            const auth = await isUserAuthenticated();
            if (!auth) return;

            try {
                const res = await checkIfFavorited(car.id);
                setIsFav(res.isFavorited);
            } catch (err) {
                console.error("Error checking favorite status:", err);
            }
        };
        checkFav();
    }, [car.id]);

    const handleCarClick = () => {
        router.push(`/all-cars/${car.id}`);
    };

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        if (loadingFav) return;

        try {
            setLoadingFav(true);
            await toggleFavoriteAPI(car.id, isFav);
            setIsFav(!isFav);
        } catch (err) {
            console.error("Error toggling favorite:", err);
        } finally {
            setLoadingFav(false);
        }
    };

    // Extracting display values
    const makeName = typeof car.make === "string" ? car.make : car.make?.name || "Car";
    const modelName = typeof car.version === "string" ? (car.model || "") : car.version?.model?.name || "";
    const versionName = car.version && typeof car.version !== "string" ? car.version.name : "";
    const cityName = typeof car.city === "string" ? car.city : car.city?.name || "Pakistan";
    const imageUrl = car.media && car.media[0] ? getImageUrl(car.media[0].image || car.media[0].media_path) : (car.images && car.images[0] ? getImageUrl(car.images[0]) : assets.car1);
    const price = car.price?.toLocaleString() || "0";
    const mileage = car.mileage?.toLocaleString() || "0";
    const transmission = typeof car.transmission === "string" ? car.transmission : car.transmission?.name || "Manual";

    const isFeatured = car.featured_listing || car.is_featured;
    const isManaged = car.is_managed;

    return (
        <div
            onClick={handleCarClick}
            className={`group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 cursor-pointer relative border border-gray-100 h-full flex flex-col
        ${isFeatured ? "border-t-4" : ""}
      `}
            style={car.featured_listing?.plan?.border_color ? { borderTopColor: car.featured_listing.plan.border_color } : {}}
        >
            {/* Top Badges */}
            <div className="absolute top-4 left-4 z-10 flex flex-col gap-2">
                {isFeatured && (
                    <div className="bg-blue-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-1 ring-white/20">
                        <Star size={12} fill="currentColor" className="text-yellow-400" />
                        FEATURED
                    </div>
                )}
                {car.featured_listing?.plan?.urgent_badge && (
                    <div className="bg-red-600/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg ring-1 ring-white/20">
                        🔥 URGENT
                    </div>
                )}
                {isManaged && (
                    <div className="bg-orange-500/90 backdrop-blur-md text-white text-[10px] font-bold px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 ring-1 ring-white/20">
                        <ShieldCheck size={12} fill="currentColor" className="text-white" />
                        MANAGED BY KAAR4U
                    </div>
                )}
            </div>

            {/* Favorite Button */}
            <button
                onClick={handleFavoriteClick}
                disabled={loadingFav}
                className="absolute top-4 right-4 z-10 p-2.5 rounded-full bg-white/80 backdrop-blur-md shadow-md hover:bg-white transition-all transform hover:scale-110 active:scale-90"
            >
                <Heart
                    size={20}
                    className={`${isFav ? "fill-red-500 text-red-500" : "text-gray-400"} transition-colors`}
                />
            </button>

            {/* Image Section */}
            <div className="relative h-56 overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={`${makeName} ${modelName}`}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>

            {/* Content Section */}
            <div className="p-6 space-y-4 flex-grow flex flex-col">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {makeName} {modelName} {versionName && <span className="text-gray-500 font-medium">({versionName})</span>}
                    </h3>
                    <div className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                        <MapPin size={14} className="text-blue-500" />
                        <span>{cityName}</span>
                    </div>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-y-3 gap-x-4 py-4 border-y border-gray-50">
                    <div className="flex items-center gap-2.5 text-gray-600">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <Zap size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-xs font-medium">{mileage} KM</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <Settings size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-xs font-medium truncate">{transmission}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-gray-600">
                        <div className="p-1.5 bg-gray-50 rounded-lg group-hover:bg-blue-50 transition-colors">
                            <User size={14} className="text-gray-400 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <span className="text-xs font-medium truncate">{car.engine_type?.name || "Petrol"}</span>
                    </div>
                    {/* Add more specs if needed */}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-auto pt-2">
                    <p className="text-2xl font-black text-blue-600">
                        <span className="text-sm font-bold text-blue-400 mr-1">PKR</span>
                        {price}
                    </p>
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center group-hover:bg-blue-600 transition-all duration-500">
                        <ArrowRight size={20} className="text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CarCard;
