"use client";

import React, { useEffect, useState } from "react";
import { Plus, Edit2, Trash2, Eye, EyeOff } from "lucide-react";
import { featuredCarsAPI } from "@/src/services/featuredCarsAPI";

interface FeaturePlan {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  credits_count: number;
  top_listing: boolean;
  urgent_badge: boolean;
  homepage_slider: boolean;
  daily_renew: boolean;
  border_color: string;
  status: "active" | "inactive";
  created_at: string;
}

export default function FeaturePlansPage() {
  const [plans, setPlans] = useState<FeaturePlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    duration_days: "",
    credits_count: "",
    top_listing: false,
    urgent_badge: false,
    homepage_slider: false,
    daily_renew: false,
    border_color: "#3B82F6",
  });

  useEffect(() => {
    // HTTP-only cookies are automatically sent with fetch requests
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError("");
      // Use adminGetPlans to fetch all plans including inactive ones
      const response = await featuredCarsAPI.adminGetPlans();
      setPlans(response.data || response || []);
    } catch (error: any) {
      const errorMessage = error instanceof Error ? error.message : "Unknown error";
      console.error("Error fetching plans:", error);
      setError(errorMessage);
      setPlans([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const planPayload = {
      ...formData,
      price: parseFloat(formData.price),
      duration_days: parseInt(formData.duration_days),
      credits_count: parseInt(formData.credits_count),
    };

    try {
      if (editingId) {
        await featuredCarsAPI.adminUpdatePlan(editingId, planPayload);
      } else {
        await featuredCarsAPI.adminCreatePlan(planPayload);
      }
      fetchPlans();
      setShowForm(false);
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error("Error saving plan:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to save plan";
      alert(`Error saving plan: ${errorMessage}`);
    }
  };

  const handleEdit = (plan: FeaturePlan) => {
    setFormData({
      name: plan.name,
      price: plan.price.toString(),
      duration_days: plan.duration_days.toString(),
      credits_count: plan.credits_count.toString(),
      top_listing: plan.top_listing,
      urgent_badge: plan.urgent_badge,
      homepage_slider: plan.homepage_slider,
      daily_renew: plan.daily_renew,
      border_color: plan.border_color,
    });
    setEditingId(plan.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this plan?")) {
      try {
        await featuredCarsAPI.adminDeletePlan(id);
        fetchPlans();
      } catch (error: any) {
        console.error("Error deleting plan:", error);
        const errorMessage = error instanceof Error ? error.message : "Failed to delete plan";
        alert(`Error deleting plan: ${errorMessage}`);
      }
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      await featuredCarsAPI.adminTogglePlanStatus(id);
      fetchPlans();
    } catch (error: any) {
      console.error("Error toggling status:", error);
      const errorMessage = error instanceof Error ? error.message : "Failed to toggle status";
      alert(`Error toggling status: ${errorMessage}`);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      price: "",
      duration_days: "",
      credits_count: "",
      top_listing: false,
      urgent_badge: false,
      homepage_slider: false,
      daily_renew: false,
      border_color: "#3B82F6",
    });
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Feature Plans</h1>
            <p className="text-gray-600 mt-1">Manage car feature pricing and plans</p>
          </div>
          <button
            onClick={() => {
              setShowForm(!showForm);
              setEditingId(null);
              resetForm();
            }}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <Plus size={20} />
            New Plan
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white p-8 rounded-lg shadow-md mb-8">
            <h2 className="text-xl font-semibold mb-6">
              {editingId ? "Edit Plan" : "Create New Plan"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="e.g., Basic, Standard, Premium"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="e.g., 500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (Days)
                  </label>
                  <input
                    type="number"
                    value={formData.duration_days}
                    onChange={(e) =>
                      setFormData({ ...formData, duration_days: e.target.value })
                    }
                    placeholder="e.g., 30"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Credits Count
                  </label>
                  <input
                    type="number"
                    value={formData.credits_count}
                    onChange={(e) =>
                      setFormData({ ...formData, credits_count: e.target.value })
                    }
                    placeholder="e.g., 3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Border Color
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={formData.border_color}
                      onChange={(e) =>
                        setFormData({ ...formData, border_color: e.target.value })
                      }
                      className="w-14 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.border_color}
                      onChange={(e) =>
                        setFormData({ ...formData, border_color: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="#3B82F6"
                    />
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-4">Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.top_listing}
                      onChange={(e) =>
                        setFormData({ ...formData, top_listing: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">Top Listing</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.urgent_badge}
                      onChange={(e) =>
                        setFormData({ ...formData, urgent_badge: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">Urgent Badge</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.homepage_slider}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          homepage_slider: e.target.checked,
                        })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">Homepage Slider</span>
                  </label>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.daily_renew}
                      onChange={(e) =>
                        setFormData({ ...formData, daily_renew: e.target.checked })
                      }
                      className="w-4 h-4 rounded border-gray-300 text-blue-600"
                    />
                    <span className="text-gray-700 font-medium">Daily Renewal</span>
                  </label>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  {editingId ? "Update Plan" : "Create Plan"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingId(null);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Plans Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">Loading plans...</p>
            </div>
          ) : error ? (
            <div className="p-8">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 font-semibold mb-2">Error Loading Plans</p>
                <p className="text-red-700 mb-4">{error}</p>
                <button
                  onClick={() => fetchPlans()}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            </div>
          ) : plans.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No plans created yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Plan Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Price
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Duration
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Credits
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Features
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <tr key={plan.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-4 h-8 rounded"
                            style={{ backgroundColor: plan.border_color }}
                          />
                          <div>
                            <p className="font-medium text-gray-900">{plan.name}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-semibold">
                        ${Number(plan.price).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {plan.duration_days} days
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {plan.credits_count} credits
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {plan.top_listing && (
                            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                              Top
                            </span>
                          )}
                          {plan.urgent_badge && (
                            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                              Urgent
                            </span>
                          )}
                          {plan.homepage_slider && (
                            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                              Slider
                            </span>
                          )}
                          {plan.daily_renew && (
                            <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                              Daily
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleToggleStatus(plan.id)}
                          className={`flex items-center gap-2 px-3 py-1 rounded text-sm font-medium transition ${plan.status === "active"
                              ? "bg-green-100 text-green-700 hover:bg-green-200"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                        >
                          {plan.status === "active" ? (
                            <>
                              <Eye size={16} /> Active
                            </>
                          ) : (
                            <>
                              <EyeOff size={16} /> Inactive
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(plan)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Edit"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete(plan.id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
