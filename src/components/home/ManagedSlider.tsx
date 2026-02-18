"use client";

import { FC, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import apiClient from "@/src/lib/api/apiClient";
import CarCard from "@/src/components/CarCard";
import { Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

const ManagedSlider: FC = () => {
    const [cars, setCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchManagedCars = async () => {
            try {
                const response = await apiClient.get("/sell-cars?is_managed=1");
                // response is already res.data because of the interceptor
                const carData = Array.isArray(response) ? response : (response?.data || []);
                setCars(carData);
            } catch (error) {
                console.error("Error fetching managed cars:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchManagedCars();
    }, []);

    if (loading) {
        return (
            <div className="py-24 bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            </div>
        );
    }

    if (cars.length === 0) return null;

    return (
        <section className="py-24 bg-gradient-to-b from-white to-orange-50/30 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full font-semibold text-sm">
                            <Sparkles className="w-4 h-4 fill-orange-700" />
                            Verified & Managed Listings
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                            Managed by <span className="text-orange-600">Kaar4u</span>
                        </h2>
                        <p className="text-gray-600 max-w-2xl">
                            These cars are personally inspected and verified by our experts. We handle everything to ensure a safe and smooth transaction for you.
                        </p>
                    </div>

                    <Link
                        href="/all-cars?managed=1"
                        className="group flex items-center gap-2 text-orange-600 font-bold text-lg hover:text-orange-700 transition-colors"
                    >
                        See all managed cars
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>

                <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={30}
                    slidesPerView={1}
                    autoplay={{ delay: 5000 }}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        640: { slidesPerView: 2 },
                        1024: { slidesPerView: 3 },
                        1280: { slidesPerView: 4 },
                    }}
                    className="pb-16"
                >
                    {cars.map((car) => (
                        <SwiperSlide key={car.id}>
                            <CarCard car={car} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

export default ManagedSlider;
