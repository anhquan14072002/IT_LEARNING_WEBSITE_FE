import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";

export default function DescriptionComponent({ id }) {
  const [problem, setProblem] = useState(null);

  useEffect(() => {
    restClient({ url: "api/problem/getproblembyid/" + id })
      .then((res) => {
        setProblem(res.data?.data);
      })
      .catch((err) => {
        setProblem(null);
      });
  }, [id]);

  return (
    <>
      <h1 className="text-4xl font-extrabold mb-4">
        Tiêu đề : {problem?.title}
      </h1>
      <p className="text-lg mb-4">
        <strong>Độ khó:</strong> {problem?.difficulty}
      </p>
      <p className="text-lg mb-4">
        <strong>Nội dung:</strong>
        <span dangerouslySetInnerHTML={{ __html: problem?.description }}></span>
      </p>
    </>
  );
}
