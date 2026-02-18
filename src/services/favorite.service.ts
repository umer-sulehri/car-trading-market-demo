import { API } from "@/src/lib/api/endpoints";
import { GET } from "@/src/lib/api/get.service";
import { POST } from "@/src/lib/api/post.service";
import apiClient from "@/src/lib/api/apiClient";

export interface FavoriteCar {
  id: number;
  make?: { id: number; name: string };
  version?: { id: number; name: string; model?: { id: number; name: string } };
  city?: { id: number; name: string };
  transmission?: { id: number; name: string };
  engineType?: { id: number; name: string };
  mileage: number;
  price: number;
  seller_name: string;
  seller_phone: string;
  phone?: string;
  status: string;
  images?: string[];
  media?: Array<{ image: string; media_path: string }>;
  user_id?: number;
  created_at?: string;
}

/**
 * Get all favorite cars for the authenticated user
 */
export const getFavoriteCars = () => {
  return GET<FavoriteCar[]>("/favorite-cars");
};

/**
 * Add a car to user's favorites
 */
export const addToFavorites = (sellCarId: number) => {
  return POST(`/favorite-cars/${sellCarId}`, {});
};

/**
 * Remove a car from user's favorites
 */
export const removeFromFavorites = (sellCarId: number) => {
  return apiClient.delete(`/favorite-cars/${sellCarId}`);
};

/**
 * Check if a car is favorited by the user
 */
export const checkIfFavorited = (sellCarId: number) => {
  return GET<{ isFavorited: boolean }>(`/favorite-cars/${sellCarId}/check`);
};

/**
 * Toggle favorite status
 */
export const toggleFavorite = async (sellCarId: number, isCurrentlyFavorited: boolean) => {
  if (isCurrentlyFavorited) {
    return removeFromFavorites(sellCarId);
  } else {
    return addToFavorites(sellCarId);
  }
};
