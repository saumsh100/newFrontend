
import axios from 'axios';
import { isOnDevice, getApiUrl } from '../util/hub';

const getTokenDefault = () => localStorage.getItem('token');
const getTokenBookingWidget = () => localStorage.getItem('auth_token');

const buildHttpClient = (getToken, requestConfig = {}) => {
  const instance = axios.create(requestConfig);

  // Add a request interceptor
  instance.interceptors.request.use(
    (config) => {
      // Set token before request is sent
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    error =>
      // Do something with request error
      Promise.reject(error),
  );

  // Add a response interceptor
  instance.interceptors.response.use(response => response, error => Promise.reject(error));

  return instance;
};

export const httpClient = config =>
  buildHttpClient(getTokenDefault, {
    baseURL: isOnDevice() ? getApiUrl() : process.env.API_SERVER_URL,
    ...config,
  });

export const bookingWidgetHttpClient = config =>
  buildHttpClient(getTokenBookingWidget, {
    baseURL: `${process.env.API_SERVER_URL}/my`,
    ...config,
  });
