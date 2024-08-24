import axios from "axios";

export const BASE_URL = "https://lw-api.azurewebsites.net";

export const BASE_URL = "http://localhost:8000";

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
