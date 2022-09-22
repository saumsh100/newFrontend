import axios from 'axios';
import { isOnDevice, getApiUrl } from './hub';
import apiHost from './getApiHost';

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
    (error) =>
      // Do something with request error
      Promise.reject(error),
  );

  // Add a response interceptor
  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  return instance;
};

export const httpClient = (config) =>
  buildHttpClient(getTokenDefault, {
    baseURL: isOnDevice() ? getApiUrl() : apiHost,
    ...config,
  });

window.$httpClient = httpClient;

export const bookingWidgetHttpClient = (config) =>
  buildHttpClient(getTokenBookingWidget, {
    baseURL: `${apiHost}/my`,
    ...config,
  });

export const httpClientbookingWidget = (config) =>
  buildHttpClient(getTokenBookingWidget, {
    baseURL: isOnDevice() ? getApiUrl() : apiHost,
    ...config,
  });
