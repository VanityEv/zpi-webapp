import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

const useAxios = () => {
  const baseURL = import.meta.env.VITE_API;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<any>(null);

  const axiosRequest = useCallback(
    async (
      method: "GET" | "POST",
      endpoint: string,
      payload?: any,
      config?: AxiosRequestConfig
    ): Promise<AxiosResponse | undefined> => {
      setLoading(true);
      setError(null);
      setData(null);

      try {
        const url = `${baseURL}${endpoint}`;
        let response: AxiosResponse;

        if (method === "GET") {
          response = await axios.get(url, config);
        } else {
          response = await axios.post(url, payload, config);
        }

        setData(response.data);
        return response;
      } catch (err: any) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    },
    [baseURL]
  );

  return { axiosRequest, loading, error, data };
};

export default useAxios;
