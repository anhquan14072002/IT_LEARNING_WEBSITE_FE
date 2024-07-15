import restClient from "./restClient";

export function getExamById(id) {
    return restClient({
      url: `api/exam/getexambyid/${id}`,
      method: `GET`
    });
  }