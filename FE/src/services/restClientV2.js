import axios from "axios";

const BASE_URL = "https://judge0-extra-ce.p.rapidapi.com";

// The function to call the API
export default function restClientV2({
  url,
  method = "GET",
  params,
  data,
  headers = {},
}) {
  return axios({
    url: `${BASE_URL}/${url}`, 
    method,
    params,
    data,
    headers: {
      ...headers,
      "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
      "x-rapidapi-key": "d4945d8336mshc741e0914347dccp167230jsn0dd36c7b7999", 
    },
  });
}
