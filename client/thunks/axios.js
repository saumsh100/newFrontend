import axios from 'axios'
import { browserHistory } from 'react-router';

// Add a request interceptor
axios.interceptors.request.use(function (config) {
  // Set token before request is sent
  config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
axios.interceptors.response.use(function (response) {
  return response;
}, function (error) {
  // Log out on 401
  if (error.status === 401) {
    localStorage.setItem('token', '')
    browserHistory.push('/login');
  }
  return Promise.reject(error);
});

export default axios;
