import axios from "axios";

const BASE_URL = "http://localhost:5152";

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
