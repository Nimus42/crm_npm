import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Базовый инстанс
export const api = axios.create({
  baseURL: 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Перехватчик запросов: добавление токена
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // В Next.js нужно убедиться, что код выполняется на клиенте
    if (typeof window !== 'undefined') {
      const accessToken = localStorage.getItem('accessToken');
      if (accessToken && config.headers) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Переменные для механизма обновления токена
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Перехватчик ответов: обработка ошибки 401
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Если ошибка 401 и мы еще не пытались повторить этот запрос
    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      if (isRefreshing) {
        // Если токен уже обновляется другим запросом, ставим этот запрос в очередь
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
        
        if (!refreshToken) {
          throw new Error('Refresh token missing');
        }

        // Делаем чистый запрос через обычный axios, чтобы не зациклить интерсепторы
        const { data } = await axios.post('http://localhost:3000/auth/refresh', {}, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const newAccessToken = data.accessToken;
        const newRefreshToken = data.refreshToken;

        if (typeof window !== 'undefined') {
          localStorage.setItem('accessToken', newAccessToken);
          localStorage.setItem('refreshToken', newRefreshToken);
        }

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        }

        processQueue(null, newAccessToken);
        return api(originalRequest);
        
      } catch (refreshError) {
        processQueue(refreshError, null);
        
        // Если не удалось обновить токен — очищаем данные и редиректим на логин
        if (typeof window !== 'undefined') {
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/auth/login';
        }
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);