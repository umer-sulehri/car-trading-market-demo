import apiClient from "@/src/lib/api/apiClient";
import { API } from "@/src/lib/api/endpoints";

/* ===================== USER SELL CARS ===================== */
export const getMySellCars = () => {
  return apiClient.get("/my-sell-cars");
};

/* =====================  SELL CARS ===================== */
export const getAdminSellCars = () => {
  return apiClient.get("/admin/sell-cars");
};

export const updateSellCarStatus = (sellCarId: number, status: "pending" | "approved" | "rejected") => {
  return apiClient.put(`/admin/sell-cars/${sellCarId}/status`, { status });
};
