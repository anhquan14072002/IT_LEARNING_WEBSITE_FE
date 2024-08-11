import axios from "axios";

const BASE_URL = "https://judge0-extra-ce.p.rapidapi.com/languages";

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
      "x-rapidapi-key": "dbc4c81344msh45e460ce8331a61p1dff48jsn75d8386e64cf",
    },
  });
}

// Calling the function
const requestData = {
  url: "languages/10",
  method: "GET",
  headers: {
    "x-rapidapi-host": "judge0-extra-ce.p.rapidapi.com",
    "x-rapidapi-key": "dbc4c81344msh45e460ce8331a61p1dff48jsn75d8386e64cf"
  }
};

restClientV2(requestData)
  .then(response => {
    console.log("Response:", response.data);
  })
  .catch(error => {
    console.error("Error:", error);
  });
