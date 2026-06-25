import axios from "axios";

export const axiosApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const getAccessToken = () => localStorage.getItem("userToken");

axiosApi.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isRefreshRequest = originalRequest.url?.includes(
      "/user/refresh-token",
    );
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshRequest
    ) {
      originalRequest._retry = true;
      try {
        const response = await axiosApi.post("/user/refresh-token");
        const { accessToken } = response.data;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axiosApi(originalRequest);
      } catch {
        localStorage.removeItem("userToken");
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  },
);
