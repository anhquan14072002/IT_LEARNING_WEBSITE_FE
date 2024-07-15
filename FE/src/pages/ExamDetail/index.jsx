import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import { getExamById } from "../../services/examService";
import { Viewer, Worker } from "@react-pdf-viewer/core";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/core/lib/styles/index.css";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { highlightPlugin } from "@react-pdf-viewer/highlight";
import "@react-pdf-viewer/highlight/lib/styles/index.css";
import { useNavigate, useParams } from "react-router-dom";
import "./index.css";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import { Toast } from "primereact/toast";

const ExamDetail = () => {
  const toast = useRef(null);
  const [viewPdf, setViewPdf] = useState(null);
  const [data, setData] = useState([]);
  const [answers, setAnswers] = useState({});
  const newPlugin = defaultLayoutPlugin();
  const new1Plugin = highlightPlugin();
  const { id } = useParams();
  const navigate = useNavigate()
  const userId = localStorage.getItem("userId")
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getExamById(id);
        console.log(response?.data?.data);
        setData(response?.data?.data);
        setViewPdf(response?.data?.data?.examFile);
        initializeAnswers(response?.data?.data?.numberOfQuestions); // Initialize answers state based on number of questions
      } catch (error) {
        console.error("Error fetching exam:", error);
      }
    };
    fetchData();
  }, [id]);

  const initializeAnswers = (numberOfQuestions) => {
    const initialAnswers = {};
    for (let i = 1; i <= numberOfQuestions; i++) {
      initialAnswers[`question${i}`] = "";
    }
    setAnswers(initialAnswers);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setAnswers({ ...answers, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(data?.numberQuestion);
    const formattedAnswers = Object.keys(answers).map((key) => ({
      numberOfQuestion: parseInt(key.replace("question", ""), 10),
      answer: answers[key],
    }));
    console.log("Submitted answers:", formattedAnswers);
    const payload = {
      userId: userId,
      examId: data.id,
      userAnswerDtos: formattedAnswers
    };
    console.log(payload);
    try {
  await restClient({
        url: "api/userexam/submitexam",
        method: "POST",
        data: payload,
      });
      SUCCESS(toast, "Nộp bài thành công ");
      setTimeout(()=>{
        navigate(`/examresult/${userId}`)
      },1000)
    } catch (error) {
      console.error("Error adding exam:", error);
      REJECT(toast, error.message);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <Header />
      <div className="m-4">
      <div className="text-2xl font-semibold mb-4">{data?.title}</div>
      <div className="h-screen w-full flex mt-5 justify-start items-start">
        <div className="w-3/4 h-full p-4">
          <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
            {viewPdf ? (
              <Viewer fileUrl={viewPdf} plugins={[newPlugin, new1Plugin]} />
            ) : (
              <div>No PDF</div>
            )}
          </Worker>
        </div>
        {/* Right frame containing the answer choices */}
        <div className="w-1/4 h-3/4 border-l border-gray-200 p-4">
          <div className="text-xl font-semibold mb-4">Đáp Án</div>
          <div style={{ height: "100%", overflowX: "auto" }}>
            <form onSubmit={handleSubmit} className="h-fit">
              {/* Example for 20 questions, adjust as per your actual number of questions */}
              {Array.from({ length: data?.numberQuestion }, (_, index) => index + 1).map(
                (questionNumber) => (
                  <div
                    key={`question-${questionNumber}`}
                    className="w-1/4 h-full border-l border-gray-200 p-4"
                  >
                    <div className="flex items-center space-x-4">
                      <span>{questionNumber}</span>
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          id={`answerA${questionNumber}`}
                          name={`question${questionNumber}`}
                          value="A"
                          checked={answers[`question${questionNumber}`] === "A"}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor={`answerA${questionNumber}`}
                          className="answer-label"
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
                          checked={answers[`question${questionNumber}`] === "B"}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor={`answerB${questionNumber}`}
                          className="answer-label"
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
                          checked={answers[`question${questionNumber}`] === "C"}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor={`answerC${questionNumber}`}
                          className="answer-label"
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
                          checked={answers[`question${questionNumber}`] === "D"}
                          onChange={handleInputChange}
                        />
                        <label
                          htmlFor={`answerD${questionNumber}`}
                          className="answer-label"
                        >
                          D
                        </label>
                      </div>
                    </div>
                  </div>
                )
              )}
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
              className=" mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Submit
            </span>
          </label>
        </div>
      </div>
      </div>
    </>
  );
};

export default ExamDetail;