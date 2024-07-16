import React, { useState, useEffect, useRef } from "react";
import QuizResult from "../../components/QuizResult";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faTimes } from "@fortawesome/free-solid-svg-icons";
import { ProgressBar } from "primereact/progressbar";
import { Button } from "primereact/button";
import "./index.css"; // Assuming you have your styles in index.css

const ViewQuestionInTest = ({ quizData }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizCompleted,setQuizCompleted] = useState(false);
  const questionRefs = useRef([]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime === 0) {
          clearInterval(timer); // Stop the timer
          handleQuizCompletion(); // Handle quiz completion when time runs out
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        // Adjust 200 to the desired scroll position
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Function to scroll to a specific question number
  const scrollToQuestion = (index) => {
    if (questionRefs.current[index]) {
      questionRefs.current[index].scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const isAnswerSelected = (questionId, answerId) => {
    return selectedAnswers[questionId] === answerId;
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleQuizCompletion = () => {
    setQuizCompleted(true); // Set quizCompleted to true
  };

  if (quizCompleted) {
    return (
      <QuizResult
        totalQuestions={quizData.length}
        quizData={quizData}
      />
    );
  }

  return (
    <div className="flex justify-center flex-wrap" id="question">
      {/* Question Box */}
      <div className="lesson-box w-3/4 p-4">
        {quizData?.map((question, index) => (
          <div
            key={question.id}
            ref={(el) => (questionRefs.current[index] = el)} // Assigning ref to each question div
            className="border shadow-lg p-5 rounded-lg mb-4"
          >
            <p>Câu {`${index + 1}: `}</p>
            <div dangerouslySetInnerHTML={{ __html: question.content }}></div>
            <ul className="flex flex-wrap gap-5">
              {question.quizAnswers.map((answer) => (
                <li key={answer.id}>
                  <label>
                    <input
                      type="radio"
                      name={`question_${question.id}`}
                      value={answer.id}
                      checked={isAnswerSelected(question.id, answer.id)}
                      onChange={() =>
                        handleAnswerSelect(question.id, answer.id)
                      }
                    />
                    {answer.content}
                  </label>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Lesson Box */}
      <div className="question-box p-4">
        <Button label="Nộp bài" className="text-center bg-blue-600 hover:bg-blue-400 text-white w-full mb-2 py-1"/>
        <div className="text-right text-blue-600 underline">
          Thời gian làm bài: {Math.floor(timeLeft / 60)}:
          {timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60}
        </div>
        <ul className="flex flex-wrap gap-2 border p-5 justify-center shadow-lg">
          {quizData?.map((question, index) => (
            <li
              key={question.id}
              className={`w-1/4 rounded-full text-center ${
                isAnswerSelected(question.id)
                  ? "border-black border"
                  : "bg-blue-500 text-white"
              }`}
              onClick={() => scrollToQuestion(index)}
              style={{ cursor: "pointer" }}
            >
              {`${index + 1}`}
            </li>
          ))}
        </ul>
      </div>

      {/* Back to Top Button */}
      {showBackToTop && (
        <Button
          icon="pi pi-arrow-up"
          className="back-to-top-btn fixed bottom-4 right-4 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow-md"
          onClick={scrollToTop}
        />
      )}
    </div>
  );
};

export default ViewQuestionInTest;
