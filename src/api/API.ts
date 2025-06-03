// import axios from 'axios';

// const api = axios.create({
//     baseURL: "http://localhost:8000"
// });

// export default api;

import axios, { AxiosInstance } from 'axios';

// Получаем текущий протокол и хост из браузера
const protocol = window.location.protocol; // 'http:' или 'https:'
const host = window.location.hostname; // 'localhost' или '192.168.3.3' и т.п.

// Порт, на котором слушает ваш FastAPI
const API_PORT = 8000;

// Собираем URL
const baseURL = `${protocol}//${host}:${API_PORT}` as const;

// Создаём инстанс axios
const api: AxiosInstance = axios.create({
    baseURL,
    // Опционально: общее время ожидания и обработка особых статусов
    timeout: 10_000,
    validateStatus: (status) => (status >= 200 && status < 300) || status === 208,
});

export default api;

// import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// const baseURLs = ['http://localhost:8000', 'http://192.168.3.3:8000'];

// const core = axios.create(); // без baseURL

// /**
//  * Пытается выполнить запрос по каждому baseURL, пока один не отработает успешно.
//  */
// export async function requestWithPool<T = unknown>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
//     let lastError: AxiosError<T> | Error | null = null;

//     for (const baseURL of baseURLs) {
//         try {
//             const response = await core.request<T>({
//                 ...config,
//                 baseURL,
//             });
//             return response;
//         } catch (err: unknown) {
//             // Запоминаем последнюю ошибку для повторного выброса
//             if (axios.isAxiosError<T>(err)) {
//                 lastError = err;
//                 console.warn(`Request to ${baseURL}${config.url} failed:`, err.message, err.response?.status);
//             } else if (err instanceof Error) {
//                 lastError = err;
//                 console.warn(`Request to ${baseURL}${config.url} failed:`, err.message);
//             } else {
//                 // Если это что‑то совсем экзотическое — упакуем в Error
//                 lastError = new Error(String(err));
//                 console.warn(`Request to ${baseURL}${config.url} failed with non-error:`, err);
//             }
//             // переходим к следующему URL
//         }
//     }

//     // если все упали — выбрасываем последнюю
//     if (lastError) {
//         throw lastError;
//     }
//     // на случай, если база была пуста
//     throw new Error('No base URLs configured');
// }
