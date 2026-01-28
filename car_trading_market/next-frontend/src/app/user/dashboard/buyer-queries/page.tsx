"use client";

import { useEffect, useState } from "react";
import { getSellerQueries, updateQueryStatus, deleteBuyerQuery } from "@/src/services/buyer.service";
import { MessageSquare, Trash2, Eye, CheckCircle, Clock, X } from "lucide-react";
import Link from "next/link";

interface BuyerQueryDisplay {
  id: number;
  sell_car_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  offer_price?: number;
  message: string;
  status: 'pending' | 'viewed' | 'responded' | 'closed';
  created_at: string;
  sellCar?: {
    id: number;
    make?: { name: string };
    version?: { name: string };
    price: number;
  };
}

export default function BuyerQueriesPage() {
  const [queries, setQueries] = useState<BuyerQueryDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuery, setSelectedQuery] = useState<BuyerQueryDisplay | null>(null);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchQueries();
  }, []);

  const fetchQueries = async () => {
    try {
      setLoading(true);
      const data = await getSellerQueries();
      setQueries(data?.data || data || []);
    } catch (error) {
      console.error("Error fetching queries:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (queryId: number, newStatus: string) => {
    try {
      setUpdating(true);
      await updateQueryStatus(queryId, newStatus as any);
      
      // Update local state
      setQueries(prevQueries =>
        prevQueries.map(q => 
          q.id === queryId ? { ...q, status: newStatus as any } : q
        )
      );
      
      if (selectedQuery?.id === queryId) {
        setSelectedQuery({ ...selectedQuery, status: newStatus as any });
      }
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (queryId: number) => {
    if (!confirm("Are you sure you want to delete this query?")) return;

    try {
      setUpdating(true);
      await deleteBuyerQuery(queryId);
      
      // Update local state
      setQueries(prevQueries => prevQueries.filter(q => q.id !== queryId));
      
      if (selectedQuery?.id === queryId) {
        setSelectedQuery(null);
      }
    } catch (error) {
      console.error("Error deleting query:", error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-medium"><Clock className="w-4 h-4" /> Pending</span>;
      case "viewed":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium"><Eye className="w-4 h-4" /> Viewed</span>;
      case "responded":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-medium"><CheckCircle className="w-4 h-4" /> Responded</span>;
      case "closed":
        return <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-medium"><X className="w-4 h-4" /> Closed</span>;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p className="text-gray-600 mt-4">Loading buyer queries...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
          <MessageSquare className="w-8 h-8 text-blue-600" />
          Buyer Queries
        </h1>
        <p className="text-gray-600 mt-1">Messages from interested buyers</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Total</p>
          <p className="text-3xl font-bold text-blue-600">{queries.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Pending</p>
          <p className="text-3xl font-bold text-yellow-600">{queries.filter(q => q.status === 'pending').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Viewed</p>
          <p className="text-3xl font-bold text-blue-600">{queries.filter(q => q.status === 'viewed').length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <p className="text-sm text-gray-600">Responded</p>
          <p className="text-3xl font-bold text-green-600">{queries.filter(q => q.status === 'responded').length}</p>
        </div>
      </div>

      {queries.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-4 text-lg">No buyer queries yet</p>
          <p className="text-gray-500 text-sm">Buyers interested in your cars will appear here</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queries List */}
          <div className="lg:col-span-1 space-y-3">
            {queries.map((query) => (
              <button
                key={query.id}
                onClick={() => setSelectedQuery(query)}
                className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                  selectedQuery?.id === query.id
                    ? "border-blue-600 bg-blue-50"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{query.buyer_name}</p>
                    <p className="text-sm text-gray-600 truncate">{query.buyer_email}</p>
                  </div>
                  <div className="text-right">
                    {getStatusBadge(query.status)}
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(query.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>

          {/* Query Details */}
          {selectedQuery && (
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Header */}
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">{selectedQuery.buyer_name}</h2>
                    <p className="text-gray-600 mt-1">Interested in your car listing</p>
                  </div>
                  {getStatusBadge(selectedQuery.status)}
                </div>

                {/* Car Info */}
                {selectedQuery.sellCar && (
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-xs font-semibold text-gray-600 uppercase mb-2">Car Details</p>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-semibold text-gray-900">
                          {selectedQuery.sellCar.make?.name} {selectedQuery.sellCar.version?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Rs. {selectedQuery.sellCar.price?.toLocaleString()}
                        </p>
                      </div>
                      <Link
                        href={`/all-cars/${selectedQuery.sell_car_id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View →
                      </Link>
                    </div>
                  </div>
                )}

                {/* Buyer Contact Info */}
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-3">Buyer Contact</p>
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-blue-600">Email</p>
                      <a href={`mailto:${selectedQuery.buyer_email}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {selectedQuery.buyer_email}
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-blue-600">Phone</p>
                      <a href={`tel:${selectedQuery.buyer_phone}`} className="text-sm font-medium text-gray-900 hover:text-blue-600">
                        {selectedQuery.buyer_phone}
                      </a>
                    </div>
                    {selectedQuery.offer_price && (
                      <div>
                        <p className="text-xs text-blue-600">Offer Price</p>
                        <p className="text-sm font-medium text-gray-900">
                          Rs. {selectedQuery.offer_price.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <p className="text-sm font-semibold text-gray-900 mb-3">Message</p>
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed">
                      {selectedQuery.message}
                    </p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-gray-900">Change Status</p>
                  <div className="flex flex-wrap gap-2">
                    {(['pending', 'viewed', 'responded', 'closed'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedQuery.id, status)}
                        disabled={updating || selectedQuery.status === status}
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedQuery.status === status
                            ? "bg-gray-200 text-gray-600 cursor-not-allowed"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        } disabled:opacity-50`}
                      >
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <div className="pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleDelete(selectedQuery.id)}
                    disabled={updating}
                    className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete Query
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
