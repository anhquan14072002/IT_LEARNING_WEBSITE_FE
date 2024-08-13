import React, { useState, useEffect, useRef } from "react";
import QuizResult from "../../components/QuizResult";
import { Button } from "primereact/button";
import { Image } from "primereact/image";
import parse from "html-react-parser";
import "./index.css";
import { useSelector } from "react-redux";
import restClient from "../../services/restClient";

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
  console.log("====================================");
  console.log("quizData?.length::", quizData?.length);
  console.log("====================================");
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [timeLeft, setTimeLeft] = useState(quizData?.length * 30 || 30);
  const questionRefs = useRef([]);
  const user = useSelector((state) => state.user.value);
  const [isCompleted, setIsCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState(null);

  useEffect(() => {
    if (quizData && quizData?.length > 0) {
      setTimeLeft(quizData?.length * 30);
      const initialSelectedAnswers = {};
      quizData.forEach((question) => {
        initialSelectedAnswers[question.id] = null;
      });
      setSelectedAnswers(initialSelectedAnswers);
    }
  }, [quizData]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => {
          return prevTime - 1;
        });
      }, 1000);

      return () => {
        clearInterval(timer);
      };
    }
  }, [isCompleted]);

  useEffect(() => {
    if (timeLeft === 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

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

  // const handleAnswerSelect = (questionId, answerId) => {
  //   setSelectedAnswers((prevState) => {
  //     // Check if the answerId is already in the array
  //     const isSelected = prevState[questionId]?.includes(answerId);

  //     if (isSelected) {
  //       // Remove answerId from the array if already selected
  //       const updatedAnswers = prevState[questionId].filter(
  //         (id) => id !== answerId
  //       );
  //       return {
  //         ...prevState,
  //         [questionId]:
  //           updatedAnswers.length === 0 ? undefined : updatedAnswers, // Remove key if array is empty
  //       };
  //     } else {
  //       // Add answerId to the array if not selected
  //       return {
  //         ...prevState,
  //         [questionId]: [...(prevState[questionId] || []), answerId],
  //       };
  //     }
  //   });
  // };

  const handleAnswerSelect = (questionId, answerId) => {
    setSelectedAnswers((prevState) => {
      const currentSelection = prevState[questionId];
  
      if (Array.isArray(currentSelection)) {
        // Handle multiple choice questions
        const isSelected = currentSelection.includes(answerId);
        if (isSelected) {
          // Remove answerId from the array if already selected
          return {
            ...prevState,
            [questionId]: currentSelection.filter((id) => id !== answerId),
          };
        } else {
          // Add answerId to the array if not selected
          return {
            ...prevState,
            [questionId]: [...currentSelection, answerId],
          };
        }
      } else {
        // Initialize or handle non-array selections
        return {
          ...prevState,
          [questionId]: [answerId],
        };
      }
    });
  };

  const isAnswerSelected = (questionId, answerId) => {
    return !selectedAnswers[questionId]
      ? true
      : selectedAnswers[questionId] === answerId;
  };

  const scrollToQuestion = (index) => {
    const element = questionRefs.current[index];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "end" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
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

  const handleAnswerSelectOne = (questionId, answerId) => {
    setSelectedAnswers((prevState) => ({
      ...prevState,
      [questionId]: answerId,
    }));
  };

  const isAnswerSelectedOne = (questionId, answerId) => {
    return selectedAnswers[questionId] === answerId;
  };

  const handleSubmitQuiz = async () => {
    const questionAnswerDto = Object.keys(selectedAnswers).map(
      (questionId,index) => ({
        type: quizData[index]?.type,
        questionId: parseInt(questionId),
        answerId:
          selectedAnswers[questionId] === null
            ? null
            : Array.isArray(selectedAnswers[questionId])
            ? selectedAnswers[questionId]
            : [selectedAnswers[questionId]],
      })
    );

    const quizId = quizDetail?.id;
    const userId = user?.sub;

    const dataToSend = {
      questionAnswerDto,
      quizId,
      userId,
    };

    console.log("====================================");
    console.log("Selected Answers: ", selectedAnswers);
    console.log("Data to Send: ", dataToSend);
    console.log("====================================");

    await restClient({
      url: "api/userquiz/submitquiz",
      data: dataToSend,
      method: "POST",
    })
      .then((res) => {
        console.log("====================================");
        console.log(res?.data?.data);
        console.log("====================================");
        setQuizResult(res?.data?.data); // Store the result data
        setIsCompleted(true);
        setTimeLeft(-1);
      })
      .catch((err) => {
        alert("Xảy ra lỗi khi nộp bài");
      })
      .finally(() => {
        const initialSelectedAnswers = {};
        quizData.forEach((question) => {
          initialSelectedAnswers[question.id] = null;
        });
        setSelectedAnswers(initialSelectedAnswers);
      });
  };

  if (isCompleted) {
    return (
      <QuizResult
        totalQuestions={quizData.length}
        historyQuizzes={quizResult?.historyQuizzes}
        quizResult={quizResult}
      />
    );
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
            id={`question_${questionIndex}`}
            ref={(el) => (questionRefs.current[questionIndex] = el)}
            className="border shadow-lg p-5 rounded-lg mb-4"
          >
            <p className="font-bold">Câu {`${questionIndex + 1}: `}</p>
            <div>{renderHtmlContent(question.content)}</div>
            {(Number(question?.type) === 2 || Number(question?.type) === 1) && (
              <p className="text-sm italic">Hãy chọn một đáp án đúng:</p>
            )}
            {Number(question?.type) === 3 && (
              <p className="text-sm italic">Hãy chọn nhiều đáp án đúng:</p>
            )}
            <ul className="flex flex-wrap gap-5 mt-5">
              {(Number(question?.type) === 2 || Number(question?.type) === 1) &&
                question?.quizAnswers?.map((answer, index) => (
                  <li key={answer?.id}>
                    <label>
                      <input
                        type="radio"
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={isAnswerSelectedOne(question.id, answer.id)}
                        onChange={() =>
                          handleAnswerSelectOne(question.id, answer.id)
                        }
                      />
                      {answer.content}
                    </label>
                  </li>
                ))}

              {/* {Number(question?.type) === 3 &&
                question?.quizAnswers?.map((answer, index) => (
                  <li key={answer?.id}>
                    <label>
                      <input
                        type="checkbox"
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={
                          Array.isArray(selectedAnswers[question.id]) &&
                          selectedAnswers[question.id]?.includes(answer.id)
                        }
                        onChange={() =>
                          handleAnswerSelect(question.id, answer.id)
                        }
                      />
                      {answer.content}
                    </label>
                  </li>
                ))} */}
              {Number(question?.type) === 3 &&
                question?.quizAnswers?.map((answer) => (
                  <li key={answer?.id}>
                    <label>
                      <input
                        type="checkbox"
                        name={`question_${question.id}`}
                        value={answer.id}
                        checked={
                          Array.isArray(selectedAnswers[question.id]) &&
                          selectedAnswers[question.id]?.includes(answer.id)
                        }
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
      <div className="question-box p-4 z-10">
        <Button
          label="Nộp bài"
          className="text-center bg-blue-600 hover:bg-blue-400 text-white w-full mb-2 py-1"
          onClick={handleSubmitQuiz} // Call function to submit quiz
        />
        <div className="text-right text-red-600 underline">
          Thời gian làm bài:{" "}
          {timeLeft > 0
            ? `${Math.floor(timeLeft / 60)}:${
                timeLeft % 60 < 10 ? "0" + (timeLeft % 60) : timeLeft % 60
              }`
            : "0:00"}
        </div>

        <ul className="flex flex-wrap gap-2 border p-5 justify-center shadow-lg">
          {quizData?.map((question, index) => (
            <li
              key={question.id}
              onClick={() => scrollToQuestion(index)}
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
