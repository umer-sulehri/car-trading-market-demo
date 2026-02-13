"use client";

import React, { useState, useEffect } from "react";
import { Star, X, ArrowRight } from "lucide-react";
import Link from "next/link";

interface FeaturePromptModalProps {
  carId: number;
  onClose: () => void;
  isOpen: boolean;
}

export default function FeaturePromptModal({
  carId,
  onClose,
  isOpen,
}: FeaturePromptModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full overflow-hidden animate-in duration-300">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Star size={28} fill="currentColor" className="text-white" />
            <h2 className="text-xl font-bold text-white">Get More Visibility!</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-1 rounded transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-gray-700 text-base">
            Your car listing is now active! 🎉
          </p>

          <p className="text-gray-600 text-sm">
            Make it stand out from other listings by featuring it. Featured cars get:
          </p>

          <ul className="space-y-2 bg-gray-50 p-4 rounded-lg">
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-yellow-600 font-bold text-lg mt-0.5">✓</span>
              <span>Top position on listing page</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-yellow-600 font-bold text-lg mt-0.5">✓</span>
              <span>Featured on homepage slider</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-yellow-600 font-bold text-lg mt-0.5">✓</span>
              <span>Urgent badge for visibility</span>
            </li>
            <li className="flex items-start gap-3 text-sm text-gray-700">
              <span className="text-yellow-600 font-bold text-lg mt-0.5">✓</span>
              <span>Multiple renewal options</span>
            </li>
          </ul>

          <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-900">
              <span className="font-semibold">Did you know?</span> Featured cars get 3x more
              inquiries! 📈
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 bg-gray-50 border-t">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 rounded-lg text-gray-700 hover:bg-gray-200 transition font-medium"
          >
            Maybe Later
          </button>
          <Link
            href={`/feature/${carId}/plans`}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-white hover:bg-yellow-600 transition font-bold"
          >
            Feature Now
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
}
