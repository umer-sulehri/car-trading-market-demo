import { API } from "@/src/lib/api/endpoints";
import { POST } from "@/src/lib/api/post.service";
import { GET } from "@/src/lib/api/get.service";
import { PUT } from "@/src/lib/api/put.service";
import apiClient from "@/src/lib/api/apiClient";

export interface BuyerQuery {
  id: number;
  sell_car_id: number;
  seller_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  offer_price?: number;
  message: string;
  status: 'pending' | 'viewed' | 'responded' | 'closed';
  created_at: string;
  updated_at: string;
  sellCar?: any;
  seller?: any;
}

export interface CreateBuyerQueryDTO {
  sell_car_id: number;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
  offer_price?: number;
  message: string;
}

/**
 * Submit a buyer query for a car
 */
export const submitBuyerQuery = (data: CreateBuyerQueryDTO) => {
  return POST<BuyerQuery>(`/buyer-queries`, data);
};

/**
 * Get all buyer queries for authenticated seller
 */
export const getSellerQueries = () => {
  return GET<any>(`/buyer-queries`);
};

/**
 * Get buyer queries for a specific car
 */
export const getCarQueries = (sellCarId: number) => {
  return GET<any>(`/sell-cars/${sellCarId}/queries`);
};

/**
 * Update buyer query status
 */
export const updateQueryStatus = (
  queryId: number,
  status: 'pending' | 'viewed' | 'responded' | 'closed'
) => {
  return PUT(`/buyer-queries/${queryId}/status`, { status });
};

/**
 * Delete a buyer query
 */
export const deleteBuyerQuery = (queryId: number) => {
  return apiClient.delete(`/buyer-queries/${queryId}`);
};
