// axiosInstance.js
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logIn, logOut } from '../redux/features/authSlice';
import { store } from '../redux/store';
import { useRouter } from 'next/navigation';
let NEXT_PUBLIC_BACKEND_URL_DOMAIN = process.env.NEXT_PUBLIC_BACKEND_URL_DOMAIN

const axiosInstance = axios.create({
    baseURL: NEXT_PUBLIC_BACKEND_URL_DOMAIN,
});

export const useAxios = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    // Request Interceptor
    axiosInstance.interceptors.request.use(
        (config) => {
            let token = store.getState().auth.value.access_token
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error)
    );

    // Response Interceptor
    axiosInstance.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;
            // Handle 401 Unauthorized Error
            if (error.response?.status === 401 && !originalRequest._retry) {
                originalRequest._retry = true;
                try {
                    // Request a new access token using the refresh token
                    const response = await axios.post(
                        `${NEXT_PUBLIC_BACKEND_URL_DOMAIN}/auth/token`, // Ensure this points to the correct endpoint
                        {},
                        { withCredentials: true }
                    );

                    const newAccessToken = response.data.data;
                    if (data.access_token) {
                        dispatch(logIn(data));
                    }

                    // Update original request's Authorization header and retry the request
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return axiosInstance(originalRequest);
                } catch (refreshError) {
                    console.error('Refresh token failed:', refreshError);
                    localStorage.setItem('redirectTo', window.location.pathname);
                    dispatch(logOut());
                    router.push('/login');
                    // Optionally, handle failed refresh, e.g., redirect to login
                }
            }

            return Promise.reject(error);
        }
    );

    return axiosInstance;
};
