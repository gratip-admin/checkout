import axios from "axios";
import cookie from "./cookie";
import { HttpError } from "@/types";



export const Http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASEURL,
  timeout: 45000,
  // withCredentials: false,
  headers: {
    // "X-Requested-With": "XMLHttpRequest",
    "Content-Type": "application/json",
    Accept: "application/json",
    // origin: window?.location?.origin,
  },
});

Http.interceptors.request.use((config: any) => {
  const token = cookie().getCookie("token");
  const userType = cookie().getCookie("userType");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (userType) {
    config.headers["X-User-Type"] = userType;
  }
  // if (apiKey) {
  //   config.headers["X-API-KEY"] = apiKey;
  // }

  return config;
});

Http.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    

    return Promise.reject(error);
  }
);

export default Http;
