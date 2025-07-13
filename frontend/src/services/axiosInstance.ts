import axios from 'axios';

const API = axios.create({
  baseURL:import.meta.env.VITE_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

API.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      console.warn('%c🔁 [Response] 401 Unauthorized - trying refresh...', 'color:orange;');

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            console.log('%c🔄 [Queue] Retrying request with new token', 'color:purple;');
            originalRequest.headers = {
              ...originalRequest.headers,
              Authorization: `Bearer ${token}`,
            };
            return API(originalRequest);
          })
          .catch(Promise.reject);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('%c🌐 [Refresh] Sending refresh request...', 'color:blue;');
        const res = await axios.post(
          'http://localhost:5000/auth/refresh',
          {},
          { withCredentials: true }
        );

        const newToken = res.data.access_token;
        console.log('%c✅ [Refresh] Token refreshed:', 'color:green;', newToken);

        localStorage.setItem('accessToken', newToken);
        API.defaults.headers.common.Authorization = `Bearer ${newToken}`;

        processQueue(null, newToken);

        originalRequest.headers = {
          ...originalRequest.headers,
          Authorization: `Bearer ${newToken}`,
        };

        console.log('%c🔁 [Retry] Retrying original request with new token...', 'color:teal;');
        return API(originalRequest);
      } catch (refreshErr) {
        console.error('%c❌ [Refresh Failed] Logging out...', 'color:red;', refreshErr);
        processQueue(refreshErr, null);
        localStorage.removeItem('accessToken');
        sessionStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshErr);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default API;
