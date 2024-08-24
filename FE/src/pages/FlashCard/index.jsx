import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import CategoryOfClass from "../../components/CategoryOfClass";
import DocumentClass from "../../components/DocumentClass";
import Comment from "../../components/Comment";
import LessonInDocument from "../../components/LessonInDocument";
import {
  getDocumentListByLessonId,
  getLessonById,
} from "../../services/lesson.api";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import { Button } from "primereact/button";
import restClient from "../../services/restClient";
import { decodeIfNeeded, isBase64 } from "../../utils";
import FlashcardList from "../../components/FlashcardList";
import NotifyProvider from "../../store/NotificationContext";

export default function Quiz() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const displayRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const { id } = useParams();
  const [quiz, setQuiz] = useState([]);
  const navigate = useNavigate();
  const [showAnswer, setShowAnswer] = useState(false);
  const [quizDetails, setQuizDetails] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const quizDetailRes = await restClient({
        url: `api/quiz/getquizbyid/${id}`,
        method: "GET",
      });
      setQuizDetails(quizDetailRes?.data?.data);

      const quizResponse = await restClient({
        url: `api/quizquestion/getallquizquestionbyquizid?QuizId=${id}`,
        method: "GET",
      });
      if (Array.isArray(quizResponse.data?.data)) {
        setQuiz(quizResponse?.data?.data);
      } else {
        setQuiz(null); // Set quiz to null if not found
      }
    } catch (e) {
      setQuiz(null); // Set quiz to null if there's an error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef]);

  return (
    <NotifyProvider>
      <div className="min-h-screen flex flex-col">
        <div ref={fixedDivRef} className="fixed top-0 w-full z-50">
          <Header />
          <Menu />
        </div>

        <div
          style={{ paddingTop: `${fixedDivHeight}px` }}
          className="flex flex-col justify-center items-center gap-5 h-screen bg-gray-100 mb-36"
        >
          {quiz && (
            <div className="text-center">
              <p className="mb-3 font-bold text-xl">{quizDetails?.title}</p>
              <p className="font-semibold">
                {currentCardIndex + 1}/{quiz?.length}
              </p>
            </div>
          )}
          <div
            className={`w-full sm:w-full md:w-3/4 lg:w-1/2 xl:w-1/2 
  shadow-lg rounded-md bg-white h-4/5 p-5 flex items-center justify-center cursor-pointer overflow-y-auto ${
    showAnswer ? "flip" : ""
  }`}
            onClick={() => {
              setShowAnswer(!showAnswer);
            }}
          >
            {loading ? (
              <Loading />
            ) : (
              <div className="w-full">
                {!quiz ? (
                  <p className="text-center">Quiz không tồn tại.</p>
                ) : (
                  <FlashcardList
                    flashcards={quiz}
                    currentCardIndex={currentCardIndex}
                    setCurrentCardIndex={setCurrentCardIndex}
                    showAnswer={showAnswer}
                    setShowAnswer={setShowAnswer}
                  />
                )}
              </div>
            )}
          </div>
        </div>

        <Footer ref={displayRef} />
      </div>
    </NotifyProvider>
  );
}
