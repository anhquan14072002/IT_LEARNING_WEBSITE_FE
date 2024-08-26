import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";
import { useNavigate } from "react-router-dom";

export default function DescriptionComponent({ id }) {
  const [problem, setProblem] = useState(null);
  const [tagTopic, setTagTopic] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    restClient({ url: "api/problem/getproblembyid/" + id })
      .then((res) => {
        if (res.data?.data && res.data?.data?.isActive === false) {
          navigate("/notfound");
        }
        setProblem(res.data?.data);
      })
      .catch((err) => {
        setProblem(null);
      });

    restClient({
      url: "api/problem/getproblemidbytag/" + id,
    })
      .then((res) => {
        setTagTopic(res?.data?.data);
      })
      .catch((err) => {
        setTagTopic([]);
      });
  }, [id]);

  return (
    <>
      <h1 className="text-4xl font-extrabold mb-4">
        Tiêu đề : {problem?.title}
      </h1>
      <p className="text-lg mb-4">
        <strong>Độ khó:</strong>{" "}
        {problem?.difficulty === 1
          ? "Dễ"
          : problem?.difficulty === 2
          ? "Trung bình"
          : problem?.difficulty === 3 && "Khó"}
      </p>
      <p className="text-lg mb-4">
        <strong>Nội dung:</strong>
        <span dangerouslySetInnerHTML={{ __html: problem?.description }}></span>
      </p>

      {/* tag */}
      {tagTopic.length > 0 && (
        <div className="mt-6">
          <span className="block font-semibold mb-3">
            Các từ khóa liên quan
          </span>
          <div className="flex flex-wrap gap-3">
            {tagTopic.map((tag) => (
              <div
                key={tag.id}
                className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full shadow-sm hover:bg-blue-200 transition-colors cursor-pointer"
                onClick={() => navigate("/searchTag/" + tag.id)}
              >
                {tag.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
