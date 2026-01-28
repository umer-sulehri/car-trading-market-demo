import { GET } from "@/src/lib/api/get.service";
import { POST } from "@/src/lib/api/post.service";
import apiClient from "@/src/lib/api/apiClient";
import { API } from "@/src/lib/api/endpoints";
import { SellCarResponse } from "@/src/types/lookups";
/* ===================== SELL CARS ===================== */

// Public list
export const getSellCars = (params?: any) =>
  GET(API.sellCars.list, params);

// Public single
export const getSellCarById = (id: number) =>
  GET(API.sellCars.byId(id));

export const createSellCar = (
  data: any
): Promise<SellCarResponse> => {
  return POST<SellCarResponse>(API.sellCars.create, data);
};
// Update sell car
export const updateSellCar = (id: number, data: any) =>
  apiClient.put(API.sellCars.update(id), data);

// Delete sell car
export const deleteSellCar = (id: number) =>
  apiClient.delete(API.sellCars.delete(id));


