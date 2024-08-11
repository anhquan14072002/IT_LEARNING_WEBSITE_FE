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
    url: `${BASE_URL}/${url}`,  /
    method,
    params,
    data,
    headers: {
      ...headers,
      "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
      "x-rapidapi-key": "dbc4c81344msh45e460ce8331a61p1dff48jsn75d8386e64cf", 
    },
  });
}
