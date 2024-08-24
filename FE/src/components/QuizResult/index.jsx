import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const QuizResult = ({ totalQuestions, historyQuizzes, quizResult }) => {
  const navigate = useNavigate();
  const [isView, setIsView] = useState(false);

  const handleReviewAnswers = () => {
    setIsView(!isView);
  };

  return (
    <div className="min-h-screen flex justify-center bg-gray-100 py-10">
      <div className="bg-white sm:w-3/4 rounded shadow-md h-4/5 p-20">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Kết quả</h2>
          <p className="mb-4">
            Bạn trả lời đúng{" "}
            {quizResult?.numberCorrect} trong{" "}
            {quizResult?.totalQuestion} câu hỏi.
          </p>
          <p>
            Điểm:{" "}{quizResult?.score}
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-5">
          <button
            onClick={handleReviewAnswers}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer"
          >
            {isView ? "Ẩn xem đáp án" : "Xem đáp án"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 bg-yellow-500 text-white py-2 px-4 rounded-md cursor-pointer"
          >
            Làm lại
          </button>
          <button
            onClick={() => navigate("/")}
            className="mt-4 bg-green-500 text-white py-2 px-4 rounded-md cursor-pointer"
          >
            Trở về trang chủ
          </button>
        </div>

        {isView && (
          <div className="mt-8">
            {historyQuizzes?.map((history) => (
              <div key={history?.questionId} className="mb-4">
                <h3
                  className="text-lg font-bold"
                  dangerouslySetInnerHTML={{
                    __html: history?.quizQuestionDto?.content,
                  }}
                ></h3>
                <ul className="mt-2 space-y-1">
                  {history?.quizQuestionDto?.quizAnswers.map((answer) => {
                    const isSelected = history?.answerId?.includes(answer.id);
                    const isCorrect = answer?.isCorrect;
                    const isUserAnswer = isSelected;
                    const isTrueAnswer = isCorrect;

                    let answerClass = "";
                    if (isUserAnswer && isTrueAnswer) {
                      answerClass = "bg-green-400 text-green-800"; // User selected correct answer
                    } else if (isUserAnswer && !isTrueAnswer) {
                      answerClass = "bg-red-200 text-red-800"; // User selected wrong answer
                    } else if (isTrueAnswer) {
                      answerClass = "bg-green-100 text-green-600"; // Correct answer not selected by user
                    }

                    return (
                      <li
                        key={answer?.id}
                        className={`p-2 rounded-md text-left ${answerClass}`}
                      >
                        {answer?.content}{" "}
                        {isUserAnswer &&
                          (isCorrect ? (
                            <FontAwesomeIcon
                              icon={faCheck}
                              className="text-green-600 ml-2"
                            />
                          ) : (
                            <FontAwesomeIcon
                              icon={faTimes}
                              className="text-red-600 ml-2"
                            />
                          ))}
                        {!isUserAnswer && isTrueAnswer && (
                          <FontAwesomeIcon
                            icon={faCheck}
                            className="text-green-600 ml-2"
                          />
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizResult;
