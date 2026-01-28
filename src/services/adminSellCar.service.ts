import apiClient from "@/src/lib/api/apiClient";
import { API } from "@/src/lib/api/endpoints";

/* ===================== USER SELL CARS ===================== */
export const getMySellCars = () => {
  return apiClient.get("/my-sell-cars");
};

export const getMySellCar = (id: number) => {
  return apiClient.get(`/sell-cars/${id}`);
};

export const updateMySellCar = (id: number, data: any) => {
  return apiClient.put(`/sell-cars/${id}`, data);
};

export const deleteMySellCar = (id: number) => {
  return apiClient.delete(`/sell-cars/${id}`);
};

/* =====================  SELL CARS ===================== */
export const getAdminSellCars = () => {
  return apiClient.get("/admin/sell-cars");
};

export const updateSellCarStatus = (sellCarId: number, status: "pending" | "approved" | "rejected") => {
  return apiClient.put(`/admin/sell-cars/${sellCarId}/status`, { status });
};
