import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// 공통 API 요청 설정
api.interceptors.request.use((config) => {
  config.params = {
    ...config.params,
    api_key: import.meta.env.VITE_API_KEY,
    language: 'ko-KR',
  };

  return config;
});