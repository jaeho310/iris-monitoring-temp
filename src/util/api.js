import axios from "axios";

let __config = {
  // local
  // baseURL: 'http://127.0.0.1:8080',

  // dev server
  baseURL: 'http://192.168.105.33:8080',

  // hyobin server
  // baseURL: 'http://192.168.202.54:8080',

  // timeout: 5000,
  // headers: { 'Authorization': `Basic UGxhdDpQbGF0OTkl` }
  // withCredentials: false,
  // maxContentLength: 2000,
};

const __http = axios.create(__config);
__http.interceptors.request.use(
  config => {
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
__http.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    return Promise.reject(error);
  }
);

export default __http;
