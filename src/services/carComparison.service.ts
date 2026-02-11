import apiClient from "@/src/lib/api/apiClient";
import { GET } from "@/src/lib/api/get.service";
import { POST } from "@/src/lib/api/post.service";
import { PUT } from "@/src/lib/api/put.service";
import { API } from "@/src/lib/api/endpoints";

export const carComparisonService = {
  /**
   * Get all car comparisons (admin)
   */
  async getAllComparisons(params?: {
    page?: number;
    search?: string;
    is_active?: boolean;
  }) {
    const res = await GET<any>(API.admin.carComparisons, params);
    return res?.data ? res : res;
  },

  /**
   * Get public car comparisons
   */
  async getPublicComparisons() {
    const res = await GET<any>(API.public.carComparisons);
    return res?.data ? res : res;
  },

  /**
   * Get single comparison with details
   */
  async getComparison(id: number) {
    const res = await GET<any>(API.public.carComparison(id));
    return res?.data ? res : res;
  },

  /**
   * Create a new car comparison
   */
  async createComparison(data: {
    title: string;
    description?: string;
    version_ids: number[];
    is_active?: boolean;
  }) {
    return POST(API.admin.carComparisons, data);
  },

  /**
   * Update a car comparison
   */
  async updateComparison(
    id: number,
    data: {
      title?: string;
      description?: string;
      version_ids?: number[];
      is_active?: boolean;
    }
  ) {
    return PUT(`${API.admin.carComparisons}/${id}`, data);
  },

  /**
   * Delete a car comparison
   */
  async deleteComparison(id: number) {
    return apiClient.delete(`${API.admin.carComparisons}/${id}`);
  },

  /**
   * Toggle active status
   */
  async toggleStatus(id: number) {
    return PUT(API.admin.carComparisonsToggleStatus(id), {});
  },
};
