// lib/api/get.service.ts
import apiClient from "./apiClient";

export const GET = <T>(url: string, params?: any): Promise<T> =>
  apiClient.get(url, { params });
