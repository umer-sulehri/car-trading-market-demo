import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
  timeout: 30000, // 30 second timeout for slow API responses
  // headers: {
  //   "Content-Type": "application/json",
  //   Accept: "application/json",
  // },
});

let isRefreshing = false;
let queue: any[] = [];

apiClient.interceptors.response.use(
  (res) => res.data,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (!isRefreshing) {
        isRefreshing = true;

        try {
          await axios.post("/api/proxy/auth/refresh", {}, {
            withCredentials: true,
          });

          queue.forEach((cb) => cb.resolve(apiClient(originalRequest)));
          queue = [];
        } catch (error) {
          queue.forEach((cb) => cb.reject(error));
          queue = [];
          // Only redirect if absolutely necessary, or just reject
          // window.location.href = "/auth/login"; 
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;