// src/api/axiosInstance.ts
import axios, { AxiosError, AxiosRequestConfig } from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CORS 요청 시 credentials 포함
});

// 요청 인터셉터
axiosInstance.interceptors.request.use(
  (config) => {
    // 필요 시 토큰 주입 가능
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        return logoutAndReject();
      }

      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/refresh-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );

        const newAccessToken = response.data.data.accessToken;

        // 저장 및 헤더 교체
        localStorage.setItem("access_token", newAccessToken);
        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newAccessToken}`,
        };

        // 재요청
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        return logoutAndReject();
      }
    }

    if (error.response) {
      const {
        statusCode,
        message,
        error: errorType,
      } = error.response.data as {
        statusCode: number;
        message: string;
        error: string;
      };

      console.error(`[${statusCode}] ${errorType}: ${message}`);

      // 401 처리 예시: 리다이렉트, 토큰 삭제, alert 등
      if (statusCode === 401) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login"; // or router navigation
      }

      return Promise.reject({
        statusCode,
        message,
        errorType,
      });
    }

    // 네트워크 에러 또는 response 없는 경우
    return Promise.reject({
      statusCode: 0,
      message: "서버에 연결할 수 없습니다.",
      errorType: "NetworkError",
    });
  }
);

// logout 처리 함수
function logoutAndReject() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");

  // 서버에도 로그아웃 요청
  axios.post(`${process.env.REACT_APP_API_BASE_URL}/logout`).catch(() => {});

  window.location.href = "/login";

  return Promise.reject({
    statusCode: 401,
    message: "로그인이 만료되었습니다. 다시 로그인해주세요.",
    errorType: "Unauthorized",
  });
}

export default axiosInstance;
