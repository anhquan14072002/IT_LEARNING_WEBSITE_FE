import axios from "axios";
import { getTokenFromLocalStorage } from "../utils";


const BASE_URL = "http://localhost:2358";


export default function restClientV2({
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
