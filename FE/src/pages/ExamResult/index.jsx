import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";
import { useParams } from "react-router-dom";

const Index = () => {
  const [score, setScore] = useState(null);
  const [historyExam, setHistoryExam] = useState([]);
  const [openResult, setOpenResult] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await restClient({
          url: `api/userexam/getuserexambyid/${id}`,
          method: "GET",
        });
        setScore(response?.data?.data?.score);
        setHistoryExam(response?.data?.data?.historyExam);
        console.log(response?.data?.data?.historyExam);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id]);
  console.log(openResult);
  return (
    <div className="text-center h-screen font-sans m-5 p-5 border border-gray-300 rounded-lg shadow-lg bg-gray-200">
      <h1 className="text-2xl text-gray-800 mb-4">Điểm của bạn</h1>
      <p className="text-lg text-gray-600 mb-6"> {score}</p>
      {openResult ? (
        <button
          className="bg-blue-600 text-white p-2 text-sm font-normal"
          onClick={(e) => setOpenResult(false)}
        >
          Xem Chi Tiết Kết Quả
        </button>
      ) : (
        <>
          <div>
            <h1 className="text-2xl text-gray-800 mb-4">Chi tiết kết quả</h1>
            <div className="flex flex-col items-center">
              <div className="overflow-x-auto h-1/3">
                <table className="w-full bg-white">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 border-b">Câu hỏi số</th>
                      <th className="py-2 px-4 border-b">Đáp án của bạn</th>
                      <th className="py-2 px-4 border-b">Đáp án đúng</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historyExam.map((item, index) => (
                      <tr key={index} className="bg-gray-100 even:bg-white">
                        <td className="py-2 px-4 border-b">
                          {item?.numberOfQuestion}
                        </td>
                        <td
                          className={`py-2 px-4 border-b ${
                            item?.isCorrect ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {item?.userAnswer}
                        </td>
                        <td className="py-2 px-4 border-b text-green-600">
                          {item?.isCorrect
                            ? item?.userAnswer
                            : item?.correctAnswer}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Index;
