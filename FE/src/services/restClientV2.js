import axios from "axios";
import { getTokenFromLocalStorage } from "../utils";


const BASE_URL = "http://localhost:2358";


export default function restClientV2({
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