import { API } from "@/src/lib/api/endpoints";
import { POST } from "@/src/lib/api/post.service";
import { GET } from "@/src/lib/api/get.service";
import apiClient from "@/src/lib/api/apiClient";

/**
 * Submit a car for managed selling
 */
export const submitManagedCar = (data: any) => {
    return POST(API.managedCars.submit, data);
};

/**
 * Admin: Get all managed car requests
 */
export const getAdminManagedCars = (params?: any) => {
    return GET(API.managedCars.adminList, params);
};

/**
 * Admin: Publish/Update status of a managed car
 */
export const publishManagedCar = (id: number, data: { managed_commission: number; status: string }) => {
    return apiClient.put(API.managedCars.publish(id), data);
};
