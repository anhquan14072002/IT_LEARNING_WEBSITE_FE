import React, { useEffect, useState } from "react";
import restClient from "../../services/restClient";
import { useParams } from "react-router-dom";

const Index = () => {
  const [score, setScore] = useState(null);
  const [historyExam, setHistoryExam] = useState([]);
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

  return (
    <div className="text-center h-screen font-sans m-5 p-5 border border-gray-300 rounded-lg shadow-lg bg-gray-100">
    <h1 className="text-2xl text-gray-800 mb-4">Điểm của bạn</h1>
    <p className="text-lg text-gray-600 mb-6"> {score}</p>
    <h1>Kết quả</h1>
    <div className="flex flex-col items-center">
      {historyExam.map((item, index) => (
        <div key={index} className="bg-gray-200 p-4 mb-2 rounded-md w-4/5 max-w-md">
          Câu hỏi số {item?.numberOfQuestion} : {item?.userAnswer}
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Index;
