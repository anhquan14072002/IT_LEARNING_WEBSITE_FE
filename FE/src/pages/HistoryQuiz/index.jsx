import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import NotifyProvider from "../../store/NotificationContext";
import LoadingFull from "../../components/LoadingFull";
import { isLoggedIn } from "../../utils";
import axios from "axios"; // Ensure you have axios installed
import restClient from "../../services/restClient";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

// API functions
const fetchQuizResults = async (userId) => {
  try {
    const response = await restClient({
      url: `/api/userquiz/getalluserquizbyuserid/${userId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    return { isSucceeded: false, data: [] };
  }
};

const fetchExamResults = async (userId) => {
  try {
    const response = await restClient({
      url: `/api/userexam/getlistresultexamofuserbyuserid/${userId}`,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching exam results:", error);
    return { isSucceeded: false, data: [] };
  }
};

export default function HistoryQuiz() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("quizzes"); // 'quizzes' or 'exams'
  const [quizResults, setQuizResults] = useState([]);
  const [examResults, setExamResults] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight + 10);
    }
  }, [fixedDivRef.current]);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/notfound");
    } else {
      const fetchData = async () => {
        try {
          const [quizRes, examRes] = await Promise.all([
            fetchQuizResults(user?.sub),
            fetchExamResults(user?.sub),
          ]);

          if (quizRes.isSucceeded && examRes.isSucceeded) {
            setQuizResults(quizRes.data);
            setExamResults(examRes.data);
          } else {
            console.error("Failed to fetch data");
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [navigate, user.id]);

  const indexBodyTemplate = (rowData, { rowIndex }) => {
    return <span>{rowIndex}</span>;
  };

  const indexBodyTemplateV2 = (rowData, { rowIndex }) => {
    return <span>{rowIndex}</span>;
  };

  const formatDate = (rowData, { rowIndex }) => {
    if (!rowData?.createdDate) return null;
  
    // Parse the ISO date string into a Date object
    const date = new Date(rowData.createdDate);
  
    // Extract hours, minutes, seconds, day, month, and year
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.getMonth() + 1; // Months are zero-based
    const year = date.getFullYear();
  
    // Format the date string
    const formattedDate = `${hours}:${minutes}:${seconds} ${day} tháng ${month}, ${year}`;
  
    return <span>{formattedDate}</span>;
  };
  
  const historyExam = (rowData , {rowIndex})=>{
    return <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-400" onClick={()=>navigate('/examresult/'+rowData?.examCodeId)}>Xem lịch sử làm bài</button>
  }

  const renderQuizResults = () => (
    // <div>
    //   {quizResults.map((result) => (
    //     <div key={result.id} className="mb-4 p-4 border rounded shadow-md">
    //       <h3 className="text-xl font-bold">Quiz {result.quizId}</h3>
    //       <p>Score: {result.score}</p>
    //       <p>Total Questions: {result.totalQuestion}</p>
    //       <p>Correct Answers: {result.numberCorrect}</p>
    //       <ul>
    //         {result.historyQuizzes.map((quiz) => (
    //           <li key={quiz.questionId} className="mb-2">
    //             <h4 className="font-semibold">{quiz.quizQuestionDto.content}</h4>
    //             <p>Score: {quiz.score}</p>
    //             <p>Correct: {quiz.isCorrect ? 'Yes' : 'No'}</p>
    //             <p>Answer(s): {quiz.answerId.join(', ')}</p>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   ))}
    // </div>
    <DataTable
      value={quizResults}
      loading={loading}
      className="border-t-2"
      tableStyle={{ minHeight: "30rem" }}
      scrollable
      scrollHeight="30rem"
    >
      <Column
        field="#"
        header="#"
        body={indexBodyTemplate}
        style={{ minWidth: "3rem" }}
        className="border-b-2 border-t-2"
      />
      <Column
        header="Bộ câu hỏi"
        className="border-b-2 border-t-2"
        style={{ minWidth: "15rem" }}
        field="quizId"
      />
      <Column
        field="score"
        header="Điểm làm được"
        style={{ minWidth: "10rem" }}
        className="border-b-2 border-t-2"
      />
      <Column
        field="totalScoreQuiz"
        header="Điểm bộ câu hỏi"
        style={{ minWidth: "10rem" }}
        className="border-b-2 border-t-2"
      />
      <Column
        field="numberCorrect"
        header="Số câu làm đúng"
        style={{ minWidth: "15rem" }}
        className="border-b-2 border-t-2"
      />
      <Column
        field="totalQuestion"
        header="Tổng số câu"
        style={{ minWidth: "15rem" }}
        className="border-b-2 border-t-2"
      />
      <Column
        body={formatDate}
        header="Thời gian làm"
        style={{ minWidth: "15rem" }}
        className="border-b-2 border-t-2"
      />
    </DataTable>
  );

  const renderExamResults = () => (
    // <div>
    //   {examResults.map((result) => (
    //     <div
    //       key={result.createdDate}
    //       className="mb-4 p-4 border rounded shadow-md"
    //     >
    //       <h3 className="text-xl font-bold">Exam {result.examCodeId}</h3>
    //       <p>Score: {result.score}</p>
    //       <ul>
    //         {result.historyExam.map((exam) => (
    //           <li key={exam.numberOfQuestion} className="mb-2">
    //             <p>Question {exam.numberOfQuestion}</p>
    //             <p>Your Answer: {exam.userAnswer}</p>
    //             <p>Correct Answer: {exam.correctAnswer}</p>
    //             <p>Correct: {exam.isCorrect ? "Yes" : "No"}</p>
    //           </li>
    //         ))}
    //       </ul>
    //     </div>
    //   ))}
    // </div>
    <DataTable
      value={examResults}
      loading={loading}
      className="border-t-2"
      tableStyle={{ minHeight: "30rem" }}
      scrollable
      scrollHeight="30rem"
    >
      <Column
        field="#"
        header="#"
        body={indexBodyTemplate}
        style={{ minWidth: "3rem" }}
        className="border-b-2 border-t-2"
      />
      <Column
        header="Đề kiểm tra"
        className="border-b-2 border-t-2"
        style={{ minWidth: "15rem" }}
        field="examName"
      />
      <Column
        header="Mã đề"
        className="border-b-2 border-t-2"
        style={{ minWidth: "15rem" }}
        field="code"
      />
      <Column
        field="score"
        header="Điểm làm được"
        style={{ minWidth: "10rem" }}
        className="border-b-2 border-t-2"
      />
      <Column 
      style={{ minWidth: "15rem" }}
      className="border-b-2 border-t-2"
      body={historyExam}
      />
      <Column
        body={formatDate}
        header="Thời gian làm"
        style={{ minWidth: "15rem" }}
        className="border-b-2 border-t-2"
      />
    </DataTable>
  );

  return (
    <NotifyProvider>
      <div className="min-h-screen bg-gray-100">
        <div
          ref={fixedDivRef}
          className="fixed top-0 w-full bg-white shadow-md z-10"
        >
          <Header />
          <Menu />
        </div>
        <div
          style={{ paddingTop: fixedDivHeight }}
          className="p-4 min-h-screen"
        >
          {loading ? (
            <LoadingFull />
          ) : (
            <div>
              <div className="mb-4">
                <button
                  onClick={() => setActiveTab("quizzes")}
                  className={`px-4 py-2 mr-2 ${
                    activeTab === "quizzes"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Kết quả làm bộ câu hỏi kiểm tra
                </button>
                <button
                  onClick={() => setActiveTab("exams")}
                  className={`px-4 py-2 ${
                    activeTab === "exams"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200"
                  }`}
                >
                  Kết quả thi
                </button>
              </div>
              {activeTab === "quizzes" && renderQuizResults()}
              {activeTab === "exams" && renderExamResults()}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </NotifyProvider>
  );
}
