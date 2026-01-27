// lib/api/post.service.ts
import apiClient from "./apiClient";

export const POST = <T>(url: string, data?: any): Promise<T> =>
  apiClient.post(url, data);
