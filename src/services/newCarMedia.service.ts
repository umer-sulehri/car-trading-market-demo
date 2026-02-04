import apiClient from "@/src/lib/api/apiClient";
import { GET } from "@/src/lib/api/get.service";
import { PUT } from "@/src/lib/api/put.service";
import { POST } from "@/src/lib/api/post.service";
import { API } from "@/src/lib/api/endpoints"

export const getByModel = (modelId: number) => GET<{ id: number; url: string }[]>(`${API.admin.models}/${modelId}/media`);

// Public endpoint - no authentication required
export const getPublicByModel = (modelId: number) => GET<{ id: number; url: string }[]>(`/models/${modelId}/media`);

export const createNewCarMedia = (formData: FormData) => POST(API.admin.newCarMedia, formData);
export const deleteNewCarMedia = (id: number) => apiClient.delete(`/new-car-media/${id}`);
