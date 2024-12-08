import { Cookies } from "typescript-cookie";

export const getAuthHeader = () => {
  const token = Cookies.get('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}