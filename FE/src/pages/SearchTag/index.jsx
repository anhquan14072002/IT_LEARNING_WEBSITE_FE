import React, { useEffect, useRef, useState } from "react";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import { useNavigate, useParams } from "react-router-dom";
import { getDocumentByGradeId } from "../../services/document.api";
import Loading from "../../components/Loading";
import NotifyProvider from "../../store/NotificationContext";
import restClient from "../../services/restClient";
import LoadingFull from "../../components/LoadingFull";
import CustomPractice from "../../components/CustomPractice";
import CustomPracticeInTag from "../../components/CustomPracticeInTag";
import { Tooltip } from "primereact/tooltip";

export default function SearchTag() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tag, setTag] = useState();
  const [data, setData] = useState({
    exams: [],
    documents: [],
    topics: [],
    lessons: [],
    quizzes: [],
    problems: [],
  });
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (fixedDivRef.current) {
      setFixedDivHeight(fixedDivRef.current.offsetHeight);
    }
  }, [fixedDivRef.current]);

  useEffect(() => {
    if (id) {
      restClient({ url: "api/tag/gettagbyid?id=" + id })
        .then((res) => {
          setTag(res?.data?.data || null);
          restClient({
            url:
              "api/tag/searchtagpagination?TagValue=" +
              res?.data?.data?.keyWord,
          })
            .then((res) => {
              setData(res?.data?.data);
            })
            .catch((err) => {
              setData({
                exams: [],
                documents: [],
                topics: [],
                lessons: [],
                quizzes: [],
                problems: [],
              });
            });
        })
        .catch((err) => {
          setData({
            exams: [],
            documents: [],
            topics: [],
            lessons: [],
            quizzes: [],
            problems: [],
          });
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [id]);

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
          <div className="text-center font-bold text-xl mt-10">
            Dữ liệu của thẻ "{(tag && tag?.title) || ""}"
          </div>

          {loading ? (
            <LoadingFull />
          ) : (
            <div className="mt-10">
              {/* Display Topics */}
              {data?.topics?.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Chủ đề</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.topics?.map((topic, index) => (
                      <div
                        key={topic?.id}
                        className="bg-white hover:bg-gray-200 p-4 shadow-md rounded flex flex-col cursor-pointer"
                        onClick={() => navigate("/topic/" + topic?.id)}
                      >
                        <Tooltip target={`.topic-${index}`} />
                        <h3
                          className={`text-base truncate topic-${index}`}
                          data-pr-tooltip={topic?.title} // Tooltip content for title
                          data-pr-position="top"
                        >
                          {topic?.title}{" "}
                        </h3>
                        {/* Render topic details here */}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Display Lessons */}
              {/* {data.lessons.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Bài học</h2>
                  {data.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white hover:bg-gray-200 p-4 mb-4 shadow-md rounded"
                    >
                      <h3 className="text-base">{lesson.title}</h3>
                    
                    </div>
                  ))}
                </section>
              )} */}
              {data?.lessons?.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Bài học</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.lessons?.map((lesson, index) => (
                      <div
                        key={lesson?.id}
                        className="bg-white hover:bg-gray-200 p-4 shadow-md rounded flex flex-col cursor-pointer"
                        onClick={() =>
                          navigate("/document/lesson/" + lesson?.id)
                        }
                      >
                        <Tooltip target={`.lesson-${index}`} />
                        <h3
                          className={`text-base truncate lesson-${index}`}
                          data-pr-tooltip={lesson?.title} // Tooltip content for title
                          data-pr-position="top"
                        >
                          {lesson?.title}{" "}
                        </h3>
                        {/* Render topic details here */}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Display Quizzes */}
              {data?.quizzes?.length > 0 &&
                data?.quizzes.some((quiz) => quiz?.type === 1) && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">
                      Bộ câu hỏi ôn tập flashcards
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data?.quizzes?.map((quiz, index) => {
                        if (Number(quiz?.type) === 1) {
                          return (
                            <div
                              key={quiz?.id}
                              className="bg-white hover:bg-gray-200 p-4 mb-4 shadow-md rounded cursor-pointer"
                              onClick={() => navigate("/flashcard/" + quiz?.id)}
                            >
                              <Tooltip target={`.quiz-${index}`} />
                              <h3
                                className={`text-base truncate quiz-${index}`}
                                data-pr-tooltip={quiz?.title} // Tooltip content for title
                                data-pr-position="top"
                              >
                                {quiz?.title}
                              </h3>
                              {/* Render quiz details here */}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </section>
                )}

              {/* Display Quizzes */}
              {data?.quizzes.length > 0 &&
                data?.quizzes.some((quiz) => quiz?.type === 2) && (
                  <section className="mb-8">
                    <h2 className="text-lg font-semibold mb-4">
                      Bộ câu hỏi trắc nghiệm
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {data?.quizzes?.map((quiz, index) => {
                        if (Number(quiz?.type) === 2) {
                          return (
                            <div
                              key={quiz?.id}
                              className="bg-white hover:bg-gray-200 p-4 mb-4 shadow-md rounded cursor-pointer"
                              onClick={() => navigate("/testquiz/" + quiz?.id)}
                            >
                              <Tooltip target={`.quiz-${index}`} />
                              <h3
                                className={`text-base truncate quiz-${index}`}
                                data-pr-tooltip={quiz?.title} // Tooltip content for title
                                data-pr-position="top"
                              >
                                {quiz?.title}
                              </h3>
                              {/* Render quiz details here */}
                            </div>
                          );
                        }
                      })}
                    </div>
                  </section>
                )}

              {/* Display Exams */}
              {data?.exams?.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Đề thi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.exams?.map((exam, index) => (
                      <div
                        key={exam?.id}
                        className="bg-white hover:bg-gray-200 p-4 shadow-md rounded flex flex-col cursor-pointer"
                        onClick={() => {
                          if (exam?.type === 1) {
                            navigate(`/examdetail/${exam?.id}`);
                          } else {
                            navigate(`/examcodedetail/${exam?.id}`);
                          }
                        }}
                      >
                        <Tooltip target={`.exam-${index}`} />
                        <h3
                          className={`text-base truncate exam-${index}`}
                          data-pr-tooltip={exam?.title} // Tooltip content for title
                          data-pr-position="top"
                        >
                          {exam?.title}
                        </h3>
                        {/* Render topic details here */}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Display Exams */}
              {data?.exams?.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Đề thi</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data?.exams?.map((topic) => (
                      <div
                        key={topic?.id}
                        className="bg-white p-4 shadow-md rounded flex flex-col cursor-pointer"
                        onClick={() => navigate("/examdetail/" + topic?.id)}
                      >
                        <h3 className="text-base truncate">{topic?.title} </h3>
                        {/* Render topic details here */}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Display Problems */}
              {data?.problems?.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-lg font-semibold mb-4">Bài tập</h2>
                  <div className="flex flex-wrap justify-center gap-5">
                    {data?.problems?.map((problem, index) => (
                      <CustomPracticeInTag document={problem} key={index} />
                    ))}
                  </div>
                </section>
              )}

              {/* Handle empty states */}
              {data.problems.length === 0 &&
                data.exams.length === 0 &&
                data.documents.length === 0 &&
                data.topics.length === 0 &&
                data.lessons.length === 0 &&
                data.quizzes.length === 0 && (
                  <p className="text-center">Không có dữ liệu cho thẻ này.</p>
                )}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </NotifyProvider>
  );
}
