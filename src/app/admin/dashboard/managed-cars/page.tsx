"use client";

import { useEffect, useState } from "react";
import { getAdminManagedCars, publishManagedCar } from "@/src/services/managedCar.service";
import { CheckCircle, XCircle, Clock, ShieldCheck, DollarSign, ExternalLink } from "lucide-react";
import { getImageUrl } from "@/src/utils/imageUtils";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200'%3E%3Crect fill='%23e5e7eb' width='300' height='200'/%3E%3Ctext x='50%25' y='50%25' font-size='16' fill='%239ca3af' text-anchor='middle' dominant-baseline='middle'%3ENo Image Available%3C/text%3E%3C/svg%3E";

export default function AdminManagedCarsPage() {
    const [managedCars, setManagedCars] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [commissions, setCommissions] = useState<{ [key: number]: string }>({});

    useEffect(() => {
        fetchCars();
    }, []);

    const fetchCars = async () => {
        try {
            const data = await getAdminManagedCars();
            const cars = data?.data || data || [];
            setManagedCars(cars);

            // Initialize commissions state with existing values
            const initialComms: any = {};
            cars.forEach((car: any) => {
                initialComms[car.id] = car.managed_commission?.toString() || "";
            });
            setCommissions(initialComms);
        } catch (error) {
            console.error("Error fetching managed cars:", error);
        } finally {
            setLoading(false);
        }
    };

    const handlePublish = async (carId: number, status: string) => {
        const commission = parseFloat(commissions[carId]);
        if (isNaN(commission) && status === 'approved') {
            alert("Please enter a valid commission amount before publishing.");
            return;
        }

        try {
            await publishManagedCar(carId, {
                managed_commission: commission || 0,
                status: status
            });
            alert(`Managed car listing ${status === 'approved' ? 'published' : 'updated'}!`);
            fetchCars();
        } catch (error) {
            console.error("Error publishing managed car:", error);
            alert("Failed to update managed car. Please try again.");
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "approved":
                return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={14} /> Published</span>;
            case "pending":
                return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={14} /> Awaiting Review</span>;
            case "rejected":
                return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={14} /> Rejected</span>;
            default:
                return null;
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-10">
                <div className="space-y-1">
                    <h1 className="text-3xl font-black text-gray-900 flex items-center gap-3">
                        <ShieldCheck className="text-orange-600" size={32} />
                        Managed by Kaar4u
                    </h1>
                    <p className="text-gray-500">Review and publish car requests submitted for our managed service.</p>
                </div>
                <div className="bg-orange-50 px-4 py-2 rounded-xl border border-orange-100">
                    <span className="text-orange-700 font-bold text-sm">Total Requests: {managedCars.length}</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-4">
                    <div className="w-12 h-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-gray-500 font-medium">Fetching car requests...</p>
                </div>
            ) : managedCars.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-[2rem] border-2 border-dashed border-gray-200">
                    <ShieldCheck className="mx-auto text-gray-300 mb-4" size={64} />
                    <h3 className="text-xl font-bold text-gray-900">No managed car requests yet</h3>
                    <p className="text-gray-500">New requests from users will appear here.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {managedCars.map((car) => (
                        <div key={car.id} className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500">
                            <div className="p-6 md:p-8 grid md:grid-cols-12 gap-8">

                                {/* Image Section */}
                                <div className="md:col-span-3">
                                    <div className="relative h-48 md:h-full rounded-2xl overflow-hidden group">
                                        <Image
                                            src={car.media && car.media[0] ? getImageUrl(car.media[0].image || car.media[0].media_path) : PLACEHOLDER_IMAGE}
                                            alt={`${car.make?.name} ${car.version?.name}`}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute top-3 left-3">
                                            {getStatusBadge(car.status)}
                                        </div>
                                    </div>
                                </div>

                                {/* Info Section */}
                                <div className="md:col-span-5 space-y-4">
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900">
                                            {car.make?.name} {car.version?.model?.name}
                                        </h3>
                                        <p className="text-gray-500 font-medium">{car.version?.name} • {car.year}</p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Asking Price</span>
                                            <p className="text-lg font-bold text-blue-600">PKR {car.price?.toLocaleString()}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Mileage</span>
                                            <p className="text-lg font-bold text-gray-900">{car.mileage?.toLocaleString()} km</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-50 flex items-center gap-4">
                                        <div className="flex -space-x-2">
                                            <div className="w-8 h-8 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center text-orange-600 text-[10px] font-bold">
                                                {car.seller_name?.[0]}
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{car.seller_name}</p>
                                            <p className="text-[10px] text-gray-500">{car.seller_phone} • {car.city?.name}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions Section */}
                                <div className="md:col-span-4 bg-gray-50 rounded-3xl p-6 flex flex-col justify-between space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-bold text-gray-700 ml-1">Admin Commission (PKR)</label>
                                        <div className="relative">
                                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                                                <DollarSign size={18} />
                                            </div>
                                            <input
                                                type="number"
                                                placeholder="0.00"
                                                className="w-full pl-10 pr-5 py-3 rounded-xl border-none ring-2 ring-gray-200 focus:ring-orange-500 outline-none transition-all font-bold text-gray-900"
                                                value={commissions[car.id]}
                                                onChange={(e) => setCommissions({ ...commissions, [car.id]: e.target.value })}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-3">
                                        <button
                                            onClick={() => handlePublish(car.id, "approved")}
                                            className="py-3 bg-orange-600 text-white rounded-xl font-bold text-sm hover:bg-orange-700 shadow-lg shadow-orange-100 transition-all flex items-center justify-center gap-2"
                                        >
                                            <CheckCircle size={16} />
                                            Publish
                                        </button>
                                        <button
                                            onClick={() => handlePublish(car.id, "rejected")}
                                            className="py-3 bg-white text-red-600 border border-red-100 rounded-xl font-bold text-sm hover:bg-red-50 transition-all flex items-center justify-center gap-2"
                                        >
                                            <XCircle size={16} />
                                            Reject
                                        </button>
                                    </div>

                                    <button
                                        onClick={() => window.open(`/all-cars/${car.id}`, '_blank')}
                                        className="w-full py-2 text-gray-500 hover:text-orange-600 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                                    >
                                        View Listing Details <ExternalLink size={12} />
                                    </button>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
