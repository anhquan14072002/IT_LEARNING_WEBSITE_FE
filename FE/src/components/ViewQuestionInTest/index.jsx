import React, { useState, useEffect, useRef } from "react";
import QuizResult from "../../components/QuizResult";
import { Button } from "primereact/button";
import { Image } from "primereact/image"; // Assuming you're using PrimeReact's Image component
import parse from "html-react-parser";
import "./index.css";

const CustomImage = ({ src, alt, width }) => {
  const zoomIcon = () => {
    return <i className="pi pi-plus text-white"></i>;
  };
  const zoomOutIcon = () => {
    return <i className="pi pi-minus text-white"></i>;
  };
  const closeIcon = () => {
    return <i className="pi pi-times text-white"></i>;
  };
  return (
    <Image
      src={src}
      zoomSrc={src}
      alt={alt}
      className="hover:brightness-50 transition-all duration-300"
      style={{ width: width }}
      zoomInIcon={zoomIcon}
      zoomOutIcon={zoomOutIcon}
      closeIcon={closeIcon}
      rotateLeftIcon={<></>}
      rotateRightIcon={<></>}
      preview
    />
  );
};

const ViewQuestionInTest = ({ quizData, quizDetail }) => {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [quizCompleted, setQuizCompleted] = useState(false);
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
    setQuizCompleted(true);
  };

  const renderHtmlContent = (content) => {
    // Replace <img> tags with CustomImage components
    const options = {
      replace: ({ name, attribs, children }) => {
        if (name === "img") {
          const { src, alt, width } = attribs;
          return <CustomImage src={src} alt={alt} width={width} />;
        }
      },
    };

    return parse(content, options);
  };

  const logAllImgTags = (content) => {
    // Create a new DOMParser instance
    const parser = new DOMParser();

    // Parse the content as HTML
    const doc = parser.parseFromString(content, "text/html");

    // Query for all <img> tags
    const imgTags = doc.querySelectorAll("img");

    // Log each <img> tag
    imgTags.forEach((img) => {
      console.log(img.outerHTML);
    });
  };

  if (quizCompleted) {
    return <QuizResult totalQuestions={quizData.length} quizData={quizData} />;
  }

  return (
    <div className="flex justify-center flex-wrap" id="question">
      {/* Question Box */}
      <div className="lesson-box w-3/4 p-4">
        <h1 className="text-center font-bold text-xl mb-3">
          {quizDetail?.title}
        </h1>
        {quizData?.map((question, questionIndex) => (
          <div
            key={question?.id}
            ref={(el) => (questionRefs.current[questionIndex] = el)}
            className="border shadow-lg p-5 rounded-lg mb-4"
          >
            <p className="font-bold">Câu {`${questionIndex + 1}: `}</p>
            <div>{renderHtmlContent(question.content)}</div>
            <ul className="flex flex-wrap gap-5 mt-5">
              {question.quizAnswers.map((answer, index) => (
                <li key={answer?.id}>
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
        <Button
          label="Nộp bài"
          className="text-center bg-blue-600 hover:bg-blue-400 text-white w-full mb-2 py-1"
        />
        <div className="text-right text-red-600 underline">
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
