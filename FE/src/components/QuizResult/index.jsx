import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";

const QuizResult = ({  totalQuestions, quizData, userAnswers }) => {
  const navigate = useNavigate();
  const [isView, setIsView] = useState(false);


  const handleReviewAnswers = () => {
    setIsView(!isView);
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    quizData.forEach((question, index) => {
      const userAnswerId = userAnswers[index];
      const correctAnswer = question.quizAnswers.find(answer => answer.isCorrect);
      if (userAnswerId === correctAnswer?.id) {
        correctAnswers++;
      }
    });
    return correctAnswers;
  };

  const realScore = ((calculateScore() / totalQuestions) * 10).toFixed(2);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white w-3/4 rounded shadow-md h-4/5 p-20">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">Quiz Completed!</h2>
          <p className="mb-4">
            Bạn trả lời đúng {calculateScore()} trong {totalQuestions} câu hỏi.
          </p>
          <p className="mb-4">Điểm: {realScore}/10</p>
        </div>

        <div className="flex justify-center flex-wrap gap-5">
          <button
            onClick={handleReviewAnswers}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-md cursor-pointer"
          >
            {isView ? "Ẩn xem đáp án" : "Xem đáp án"}
          </button>
          <button
            onClick={()=>window.location.reload()}
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
            {quizData.map((question, index) => (
              <div key={question.id} className="mb-4">
                <h3 className="text-lg font-bold">{question.content}</h3>
                <ul className="mt-2 space-y-1">
                  {question.quizAnswers.map((answer) => (
                    <li
                      key={answer.id}
                      className={`p-2 rounded-md text-left ${
                        answer.isCorrect
                          ? "bg-green-200"
                          : userAnswers[index] === answer.id
                          ? "bg-red-300"
                          : ""
                      }`}
                    >
                      {userAnswers[index] === answer.id ? (
                        answer.isCorrect ? (
                          <FontAwesomeIcon icon={faCheck} className="text-green-600 mr-2" />
                        ) : (
                          <FontAwesomeIcon icon={faTimes} className="text-red-600 mr-2" />
                        )
                      ) : null}
                      {answer.content}
                    </li>
                  ))}
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
