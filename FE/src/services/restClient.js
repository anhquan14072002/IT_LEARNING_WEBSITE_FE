import axios from "axios";
import { getTokenFromLocalStorage } from "../utils";

export const BASE_URL = "http://localhost:8000";
export const BASE_URL_FE = "http://localhost:5173";

export default function restClient({
  url,
  method = "GET",
  params,
  data,
  headers
}) {
  if (getTokenFromLocalStorage()) {
    return axios({
      url: `${BASE_URL}/${url}`,
      method,
      params,
      data,
      headers: {
        ...headers,
        Authorization: `Bearer ${getTokenFromLocalStorage()}`,
      },
    });
  } else {
    return axios({
      url: `${BASE_URL}/${url}`,
      method,
      params,
      data,
      headers,
    });
  }
}
