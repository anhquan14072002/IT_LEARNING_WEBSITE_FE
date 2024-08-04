import axios from "axios";

const BASE_URL = "http://localhost:2358";

export default function restClientV2({
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


