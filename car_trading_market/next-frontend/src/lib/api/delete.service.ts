import apiClient from "./apiClient";

export const DELETE = <T>(url: string): Promise<T> =>
  apiClient.delete(url);
