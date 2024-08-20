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

export default function SearchTag() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
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
          restClient({
            url:
              "api/tag/searchtagpagination?TagValue=" + res?.data?.data?.title,
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
          {loading ? (
            <LoadingFull />
          ) : (
            <div>
              {/* Display Problems */}
              {data.problems.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Bài tập</h2>
                  <div className="flex flex-wrap justify-center gap-5">
                  {data.problems.map((problem) => (
                    <div
                      key={problem.id}
                      className="bg-white p-4 mb-4 shadow-md rounded cursor-pointer"
                      style={{width: '48%'}}
                      onClick={()=> { navigate('/codeEditor/'+problem?.id)}}
                    >
                      <h3 className="text-xl font-bold">{problem.title}</h3>
                      <p className="text-gray-500">
                        Độ khó:{" "}
                        {problem.difficulty && problem.difficulty === 1 && "Dễ"}
                        {problem.difficulty &&
                          problem.difficulty === 2 &&
                          "Trung bình"}
                        {problem.difficulty &&
                          problem.difficulty === 3 &&
                          "Khó"}
                      </p>
                      <p className="text-gray-500">
                        Từ khóa: {problem.keyWord}
                      </p>
                    </div>
                  ))}
                  </div>
                </section>
              )}

              {/* Display Exams */}
              {data.exams.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Exams</h2>
                  {data.exams.map((exam) => (
                    <div
                      key={exam.id}
                      className="bg-white p-4 mb-4 shadow-md rounded"
                    >
                      <h3 className="text-xl font-bold">{exam.title}</h3>
                      {/* Render exam details here */}
                    </div>
                  ))}
                </section>
              )}

              {/* Display Topics */}
              {data.topics.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Topics</h2>
                  {data.topics.map((topic) => (
                    <div
                      key={topic.id}
                      className="bg-white p-4 mb-4 shadow-md rounded"
                    >
                      <h3 className="text-xl font-bold">{topic.title}</h3>
                      {/* Render topic details here */}
                    </div>
                  ))}
                </section>
              )}

              {/* Display Lessons */}
              {data.lessons.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Lessons</h2>
                  {data.lessons.map((lesson) => (
                    <div
                      key={lesson.id}
                      className="bg-white p-4 mb-4 shadow-md rounded"
                    >
                      <h3 className="text-xl font-bold">{lesson.title}</h3>
                      {/* Render lesson details here */}
                    </div>
                  ))}
                </section>
              )}

              {/* Display Quizzes */}
              {data.quizzes.length > 0 && (
                <section className="mb-8">
                  <h2 className="text-2xl font-bold mb-4">Quizzes</h2>
                  {data.quizzes.map((quiz) => (
                    <div
                      key={quiz.id}
                      className="bg-white p-4 mb-4 shadow-md rounded"
                    >
                      <h3 className="text-xl font-bold">{quiz.title}</h3>
                      {/* Render quiz details here */}
                    </div>
                  ))}
                </section>
              )}

              {/* Handle empty states */}
              {data.problems.length === 0 &&
                data.exams.length === 0 &&
                data.documents.length === 0 &&
                data.topics.length === 0 &&
                data.lessons.length === 0 &&
                data.quizzes.length === 0 && <p>No data found.</p>}
            </div>
          )}
        </div>
        <Footer />
      </div>
    </NotifyProvider>
  );
}
