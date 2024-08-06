import axios from "axios";

export const BASE_URL = "https://localhost:7000";

export default function restClient({
  url,
  method = "GET",
  params,
  data,
  headers
}) {
  return axios({
    url: `${BASE_URL}/${url}`,
    method,
    params,
    data,
    headers
  })
}


