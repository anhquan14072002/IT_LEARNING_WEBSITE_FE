import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { getExamById, getExamCodeById } from "../../services/examService";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { isLoggedIn, REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import { Toast } from "primereact/toast";
import { Dropdown } from "primereact/dropdown";
import NotifyProvider from "../../store/NotificationContext";
import Menu from "../../components/Menu";

const ExamDetail = () => {
  const toast = useRef(null);
  const [viewPdf, setViewPdf] = useState(null);
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});
  const [examList, setExamList] = useState([]);
  const [selectedExamCode, setSelectedExamCode] = useState([]);
  const newPlugin = defaultLayoutPlugin();
  const [tagList, setTagList] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExamCodeById(id);
        console.log(response?.data?.data?.length);
        setData(response?.data?.data[0]);
        setExamList(response?.data?.data);
        setViewPdf(response?.data?.data[0].examFile);
        initializeAnswers(response?.data?.data?.numberQuestion);
        console.log(response?.data?.data[0]?.numberQuestion);

        const tagResponse = await restClient({
          url: `api/exam/getexamidbytag/${id}`,
          method: "GET",
        });
        setTagList(tagResponse?.data?.data);
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };
    if (isLoggedIn()) {
      fetchData();
    }
  }, [id]);

  const initializeAnswers = (numberQuestion) => {
    const initialAnswers = {};
    for (let i = 1; i <= numberQuestion; i++) {
      initialAnswers[`question${i}`] = "";
    }
    console.log(initialAnswers);
    setAnswers(initialAnswers);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numberQuestion = data?.numberQuestion;
    const allQuestions = Array.from(
      { length: numberQuestion },
      (_, index) => `question${index + 1}`
    );

    const unansweredQuestions = allQuestions.filter(
      (q) => !answers.hasOwnProperty(q)
    );
    if (unansweredQuestions.length > 0) {
      const confirmed = window.confirm(
        `Bạn còn ${unansweredQuestions.length} câu hỏi chưa trả lời. Bạn chắc chắn muốn nộp bài chứ?`
      );
      if (!confirmed) return; // If not confirmed, stop the submission
    }

    // Initialize answers for all questions, with empty string for unanswered ones
    const formattedAnswers = allQuestions.map((questionKey) => ({
      numberOfQuestion: parseInt(questionKey.replace("question", ""), 10),
      answer: answers[questionKey] || "", // Use empty string if no answer is provided
    }));

    console.log("Submitted answers:", formattedAnswers);

    // Create payload
    const payload = {
      userId: userId,
      examCodeId:selectedExamCode?.id ?selectedExamCode?.id : data?.id,
      userAnswerDtos: formattedAnswers,
    };

    try {
      // Submit the answers
      const response = await restClient({
        url: "api/userexam/submitexam",
        method: "POST",
        data: payload,
      });
      console.log(response?.data?.data);
      SUCCESS(toast, "Nộp bài thành công ");
      setTimeout(() => {
        navigate(`/examresult/${response?.data?.data}`);
      }, 1000);
    } catch (error) {
      console.error("Error adding exam:", error);
      REJECT(toast, "Nộp bài thất bại");
    }
  };

  const handleChangeExamCode = async (e) => {
    console.log(e.value);
    setSelectedExamCode(e.value);
  };
  useEffect(() => {
    if (selectedExamCode) {
      setViewPdf(selectedExamCode.examFile);
    }
  }, [selectedExamCode]);

  if (!isLoggedIn()) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-xl font-bold mb-4">
          Bạn phải đăng nhập để làm đề thi này
        </p>
        <button
          onClick={() => navigate("/login")}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Đăng nhập
        </button>
      </div>
    );
  }

  return (
    <NotifyProvider>
      <Toast ref={toast} />
      <Header />
      <Menu />
      <div className="m-4 ">
        <div className="text-2xl font-semibold mb-4 flex flex-col  ">
          <div className="mb-5"> {data?.examTitle}</div>
          {examList?.length !== 1 && (
            <>
              <div className="flex gap-3">
                <span> Mã đề</span>
                <Dropdown
                  value={selectedExamCode}
                  onChange={handleChangeExamCode}
                  options={examList}
                  optionLabel="code"
                  placeholder={data?.code}
                  className="w-fit h-fit border border-gray-700  "
                />
              </div>
            </>
          )}
        </div>
        <div
          className={`h-screen w-full flex mt-5 ${
            data?.numberQuestion > 0 ? "justify-start" : "justify-center"
          } items-start`}
        >
          <div className="w-3/4 h-full p-4  ">
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
              {viewPdf ? (
                <Viewer fileUrl={viewPdf} plugins={[newPlugin]} />
              ) : (
                <div>No PDF</div>
              )}
            </Worker>
          </div>
          {data?.numberQuestion > 0 && (
            <>
              <div className="w-1/4 h-3/4 border-l border-gray-200 p-4">
                <div className="text-xl font-semibold mb-4">Đáp Án</div>
                <div style={{ height: "100%", overflowX: "auto" }}>
                  <form onSubmit={handleSubmit} className="h-fit pb-10 ">
                    {Array.from(
                      { length: data?.numberQuestion },
                      (_, index) => index + 1
                    ).map((questionNumber) => (
                      <div
                        key={`question-${questionNumber}`}
                        className="w-1/4 h-full ml-5 p-4"
                      >
                        <div className="flex items-center space-x-4">
                          <span>{questionNumber}</span>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`answerA${questionNumber}`}
                              name={`question${questionNumber}`}
                              value="A"
                              checked={
                                answers[`question${questionNumber}`] === "A"
                              }
                              onChange={handleInputChange}
                              hidden
                            />
                            <label
                              htmlFor={`answerA${questionNumber}`}
                              className={`answer-label border border-black ml-3 p-1 rounded-full w-8 h-8 flex items-center justify-center ${
                                answers[`question${questionNumber}`] === "A"
                                  ? "bg-blue-400"
                                  : "bg-white"
                              }`}
                            >
                              A
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`answerB${questionNumber}`}
                              name={`question${questionNumber}`}
                              value="B"
                              checked={
                                answers[`question${questionNumber}`] === "B"
                              }
                              onChange={handleInputChange}
                              hidden
                            />
                            <label
                              htmlFor={`answerB${questionNumber}`}
                              className={`answer-label border border-black ml-3 p-1 rounded-full w-8 h-8 flex items-center justify-center ${
                                answers[`question${questionNumber}`] === "B"
                                  ? "bg-blue-400"
                                  : "bg-white"
                              }`}
                            >
                              B
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`answerC${questionNumber}`}
                              name={`question${questionNumber}`}
                              value="C"
                              checked={
                                answers[`question${questionNumber}`] === "C"
                              }
                              onChange={handleInputChange}
                              hidden
                            />
                            <label
                              htmlFor={`answerC${questionNumber}`}
                              className={`answer-label border border-black p-1 ml-3 rounded-full w-8 h-8 flex items-center justify-center ${
                                answers[`question${questionNumber}`] === "C"
                                  ? "bg-blue-400"
                                  : "bg-white"
                              }`}
                            >
                              C
                            </label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <input
                              type="radio"
                              id={`answerD${questionNumber}`}
                              name={`question${questionNumber}`}
                              value="D"
                              checked={
                                answers[`question${questionNumber}`] === "D"
                              }
                              onChange={handleInputChange}
                              hidden
                            />
                            <label
                              htmlFor={`answerD${questionNumber}`}
                              className={`answer-label border border-black p-1 ml-3 rounded-full w-8 h-8 flex items-center justify-center ${
                                answers[`question${questionNumber}`] === "D"
                                  ? "bg-blue-400"
                                  : "bg-white"
                              }`}
                            >
                              D
                            </label>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button
                      type="submit"
                      id="button"
                      className="hidden mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </button>
                  </form>
                </div>
                <br />
                <label htmlFor="button">
                  <span
                    id="button"
                    className=" text-xl text-center justify-center flex mt-10 bg-blue-500 hover:bg-blue-700 text-white font-bold py-4 px-10 rounded"
                  >
                    Nộp bài
                  </span>
                </label>
              </div>
            </>
          )}
          {/* Right frame containing the answer choices */}
        </div>
        {tagList.length > 0 && (
          <div className="mt-6 flex">
            <span className="block font-semibold mr-3">
              Các từ khóa liên quan:
            </span>
            <div className="flex flex-wrap gap-3">
              {tagList.map((tag) => (
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
      </div>
    </NotifyProvider>
  );
};

export default ExamDetail;
