import axios from 'axios';
import { queryClient } from '@/queryClient';

const frappeApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

frappeApi.interceptors.response.use(
  (res) => res,
  (error) => {
    const status = error.response?.status;
    if (status === 401) {
      queryClient.invalidateQueries({ queryKey: ['auth', 'currentUser'] });
    }
    return Promise.reject(error);
  }
);

export { frappeApi };
