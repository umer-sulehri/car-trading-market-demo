import axios from "axios";

const apiClient = axios.create({
  baseURL: "/api/proxy",
  withCredentials: true,
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

          queue.forEach((cb) => cb());
          queue = [];
        } catch {
          window.location.href = "/auth/login";
        } finally {
          isRefreshing = false;
        }
      }

      return new Promise((resolve) => {
        queue.push(() => resolve(apiClient(originalRequest)));
      });
    }

    return Promise.reject(error);
  }
);

export default apiClient;