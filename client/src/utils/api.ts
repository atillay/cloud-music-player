import axios from "axios";
import {getenv} from "./helpers";
import store from "../store";
import {authenticateRefreshAction} from "../actions";

let refreshSubscribers: Array<Function> = [];

const instance = axios.create({
  baseURL: getenv('REACT_APP_API_URL'),
  timeout: 0,
  headers: {
    'Content-Type': 'application/json'
  },
});

instance.interceptors.request.use(
  (config) => {

    const token = localStorage.getItem("token");

    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response.data,
  (error) => {

    // Try refresh token
    if (401 === error.response.status) {

      const originalRequest = error.config;

      const authState = store.getState().auth;

      if (false === authState.refreshTokenLoading) {
        store.dispatch(authenticateRefreshAction(authState.refreshToken));

        const unsubscribe = store.subscribe(() => {
          if (false === store.getState().auth.refreshTokenLoading) {
            onTokenRefreshed(store.getState().auth.token);
            refreshSubscribers = [];
            unsubscribe();
          }
        });
      }

      return new Promise(resolve => {
        subscribeTokenRefresh((token: string) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          axios(originalRequest).then((response) => resolve(response.data));
        });
      });
    }

    return Promise.reject(error);
  }
);

function subscribeTokenRefresh(callback: Function) {
  refreshSubscribers.push(callback);
}

function onTokenRefreshed(token: string) {
  refreshSubscribers.map(cb => cb(token));
}

export default instance;
