"use client";

import React, { useEffect, useState } from "react";
import { Check, Star, TrendingUp, Shield, Zap, Crown } from "lucide-react";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";
import { useRouter } from "next/navigation";

interface FeaturePlan {
    id: number;
    name: string;
    price: number;
    duration_days: number;
    duration_in_days_featured: number;
    credits_count: number;
    top_listing: boolean;
    urgent_badge: boolean;
    homepage_slider: boolean;
    daily_renew: boolean;
    border_color: string;
    features: string[];
    status: string;
}

export default function FeaturePlansPage() {
    const [plans, setPlans] = useState<FeaturePlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlanId, setSelectedPlanId] = useState<number | null>(null);
    const router = useRouter();

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await featuredCarsAPI.getPlans();
            setPlans(response.data || []);
        } catch (error) {
            console.error("Error fetching plans:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectPlan = async (planId: number) => {
        setSelectedPlanId(planId);

        try {
            const response = await featuredCarsAPI.purchasePlan(planId);
            const data = response.data || response; // Handle apiClient interceptor

            if (data.success) {
                alert(data.message || `Plan purchased successfully! Credits have been added to your account.`);
                router.push("/user/dashboard/featured-cars");
            } else {
                alert(data.message || "Failed to purchase plan");
            }
        } catch (error: any) {
            console.error("Error purchasing plan:", error);
            const message = error?.response?.data?.message || "Error purchasing plan. Please try again.";
            alert(message);
        } finally {
            setSelectedPlanId(null);
        }
    };

    const getPlanIcon = (planName: string) => {
        if (planName.toLowerCase().includes("premium")) return <Crown className="w-8 h-8" />;
        if (planName.toLowerCase().includes("standard")) return <Zap className="w-8 h-8" />;
        if (planName.toLowerCase().includes("basic")) return <Shield className="w-8 h-8" />;
        return <Star className="w-8 h-8" />;
    };

    const getPopularBadge = (index: number) => {
        if (index === 1) {
            return (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-1 rounded-full text-sm font-semibold shadow-lg">
                    MOST POPULAR
                </div>
            );
        }
        return null;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Choose Your Feature Plan
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Boost your car listings visibility and get more buyers with our feature plans
                    </p>
                </div>

                {loading ? (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
                        <p className="text-gray-600 mt-4">Loading plans...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {plans
                            .filter((plan) => plan.status === "active")
                            .map((plan, index) => (
                                <div
                                    key={plan.id}
                                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden ${index === 1 ? "ring-4 ring-blue-500 scale-105" : ""
                                        }`}
                                    style={{
                                        borderTop: `6px solid ${plan.border_color}`,
                                    }}
                                >
                                    {getPopularBadge(index)}

                                    <div className="p-8">
                                        {/* Icon */}
                                        <div
                                            className="inline-flex p-4 rounded-full mb-4"
                                            style={{
                                                backgroundColor: `${plan.border_color}15`,
                                                color: plan.border_color,
                                            }}
                                        >
                                            {getPlanIcon(plan.name)}
                                        </div>

                                        {/* Plan Name */}
                                        <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>

                                        {/* Price */}
                                        <div className="mb-6">
                                            <span className="text-4xl font-extrabold text-gray-900">
                                                Rs {plan.price.toLocaleString()}
                                            </span>
                                        </div>

                                        {/* Credits & Duration */}
                                        <div className="bg-gray-50 rounded-lg p-4 mb-6">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-sm text-gray-600">Credits</span>
                                                <span className="font-bold text-gray-900">{plan.credits_count}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm text-gray-600">Duration</span>
                                                <span className="font-bold text-gray-900">{plan.duration_days} days</span>
                                            </div>
                                        </div>

                                        {/* Features */}
                                        <div className="space-y-3 mb-8">
                                            {plan.features.map((feature, idx) => (
                                                <div key={idx} className="flex items-start gap-3">
                                                    <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm text-gray-700">{feature}</span>
                                                </div>
                                            ))}

                                            {/* Additional features from boolean flags */}
                                            {plan.top_listing && (
                                                <div className="flex items-start gap-3">
                                                    <TrendingUp className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium text-blue-700">Top of Listings</span>
                                                </div>
                                            )}
                                            {plan.urgent_badge && (
                                                <div className="flex items-start gap-3">
                                                    <Star className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium text-yellow-700">Urgent Badge</span>
                                                </div>
                                            )}
                                            {plan.homepage_slider && (
                                                <div className="flex items-start gap-3">
                                                    <Shield className="w-5 h-5 text-purple-500 flex-shrink-0 mt-0.5" />
                                                    <span className="text-sm font-medium text-purple-700">Homepage Slider</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* CTA Button */}
                                        <button
                                            onClick={() => handleSelectPlan(plan.id)}
                                            disabled={selectedPlanId === plan.id}
                                            className="w-full py-3 px-6 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            style={{
                                                backgroundColor: plan.border_color,
                                            }}
                                        >
                                            {selectedPlanId === plan.id ? "Processing..." : "Select Plan"}
                                        </button>
                                    </div>
                                </div>
                            ))}
                    </div>
                )}

                {/* Info Section */}
                <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">How Feature Plans Work</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div>
                            <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                                1
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Choose a Plan</h3>
                            <p className="text-gray-600 text-sm">
                                Select the plan that best fits your needs and budget
                            </p>
                        </div>
                        <div>
                            <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                                2
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Get Credits</h3>
                            <p className="text-gray-600 text-sm">
                                Receive credits to feature your car listings (1 credit = 1 featured car)
                            </p>
                        </div>
                        <div>
                            <div className="bg-blue-100 text-blue-600 rounded-full w-12 h-12 flex items-center justify-center font-bold text-xl mb-4">
                                3
                            </div>
                            <h3 className="font-semibold text-gray-900 mb-2">Boost Visibility</h3>
                            <p className="text-gray-600 text-sm">
                                Your featured cars appear at the top with premium styling
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
