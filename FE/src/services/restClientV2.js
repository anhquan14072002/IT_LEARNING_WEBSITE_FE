import axios from "axios";

const BASE_URL = "https://judge0-extra-ce.p.rapidapi.com/languages";

export default function restClientV2({
  url,
  method = "GET",
  params,
  data,
  headers,
}) {
  return axios({
    url: `${BASE_URL}/${url}`,
    method,
    params,
    data,
    headers: [
      {
        key: "x-rapidapi-host",
        value: "judge0-extra-ce.p.rapidapi.com",
      },
      {
        key: "x-rapidapi-key",
        value: "dbc4c81344msh45e460ce8331a61p1dff48jsn75d8386e64cf",
      },
    ],
  });
}
