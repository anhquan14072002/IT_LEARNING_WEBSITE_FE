import axios from "axios";
import { getTokenFromLocalStorage } from "../utils";

export const BASE_URL = "https://lw-api.azurewebsites.net";




export default function restClient({
  url,
  method = "GET",

  params = {},
  data = {},
  headers = {},
}) {
  const token = getTokenFromLocalStorage();

  return axios({
    url: `${BASE_URL}/${url}`, // Fixed the template string syntax
    method,
    params,
    data,
    headers: {
      ...headers,
      ...(token && { Authorization: `Bearer ${token}` }), // Only add Authorization header if the token exists
    },
  });

}
