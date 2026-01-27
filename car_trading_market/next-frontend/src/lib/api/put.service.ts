import apiClient from "./apiClient";

export const PUT = <T>(url: string, data?: any): Promise<T> =>
  apiClient.put(url, data);
