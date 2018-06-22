
import axios from 'axios';
import { isOnDevice, getApiUrl } from '../util/hub';

// App uses 'token', Patient App uses 'auth_token', don't ask why...
const getTokenDefault = () => localStorage.getItem('token');

if (isOnDevice()) {
  axios.defaults.baseURL = getApiUrl();
}

// Axios is a mutable library, so we need to make sure
// this is obvious. Hence why we make it a "bind" function and call it
// in the top-level app files.
export default function bindAxiosInterceptors(getToken = getTokenDefault) {
  // Add a request interceptor
  axios.interceptors.request.use(
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
      Promise.reject(error)
    
  );

  // Add a response interceptor
  axios.interceptors.response.use(
    response => response,
    error =>
      // Log out on 401
      // not needed for now, we will probably remove this
      /* if (error.status === 401) {
     localStorage.setItem('token', '');
     browserHistory.push('/login');
     }*/

      Promise.reject(error)
    
  );
}
