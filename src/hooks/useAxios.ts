/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const useAxios = <T = any, U = any>() => {
  const baseURL = import.meta.env.VITE_API;

  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<T | null>(null);

  const axiosRequest = useCallback(
    async (
      method: "GET" | "POST" | "PUT" | "DELETE",
      endpoint: string,
      payload?: U,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse<T> | undefined> => {
      setLoading(true);
      setData(null);

      try {
        const url = `${baseURL}${endpoint}`;
        let response: AxiosResponse<T>;

        switch (method) {
          case "GET":
            response = await axios.get<T>(url, config);
            break;
          case "POST":
            response = await axios.post<T>(url, payload, config);
            break;
          case "PUT":
            response = await axios.put<T>(url, payload, config);
            break;
          case "DELETE":
            response = await axios.delete<T>(url, config);
            break;
          default:
            throw new Error("Unsupported HTTP method");
        }

        setData(response.data);
        return response;
      }  finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  return { axiosRequest, loading, data };
};

export default useAxios;