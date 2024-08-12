import React, { useState, useRef, useEffect } from "react";
import arrowDown from "../../assets/img/icons8-arrow-down-50.png";
import { getDocumentByGradeId } from "../../services/document.api";
import { useNavigate } from "react-router-dom";

export default function Class({ item, index }) {
  const [toggle, setToggle] = useState(index === 0 ? true : false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("0px");
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (toggle) {
      getDocumentByGradeId(item.id, setLoading, setDocumentList);
    }
  }, [toggle, item.id]);

  // useEffect(() => {
  //   setContentHeight(toggle ? `${contentRef.current.scrollHeight}px` : "0px");
  // }, [toggle]);
  useEffect(() => {
    setTimeout(() => {
      // Function to update contentHeight based on toggle state
      const updateContentHeight = () => {
        setContentHeight(
          toggle ? `${contentRef?.current?.scrollHeight}px` : "0px"
        );
      };

      // Call initially and on toggle change
      updateContentHeight();

      // Listen to window resize events
      window.addEventListener("resize", updateContentHeight);

      // Cleanup function to remove event listener
      return () => {
        window.removeEventListener("resize", updateContentHeight);
      };
    }, 300);
  }, [toggle]);

  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  // Helper function to extract quizzes by type
  const extractQuizzesByType = (type) => {
    return (documentList?.documents ?? []).flatMap((d) =>
      (d.topics ?? []).flatMap((t) =>
        [
          ...(t.quizzes ?? []).filter((q) => q.type === type),
          ...(t.lessons ?? []).flatMap((l) => (l.quizzes ?? []).filter((q) => q.type === type)),
        ]
      )
    );
  };

  // Extract quizzes for both "Practice" and "Test"
  const practiceQuizzes = extractQuizzesByType("Practice");
  const testQuizzes = extractQuizzesByType("Test");

  const handleExam = (exam) => {
      exam?.type === 1
        ? navigate(`/examdetail/${exam.id}`)
        : navigate(`/examcodedetail/${exam.id}`);
    
  }
  return (
    <div>
      <div
        className="mt-4 flex items-center justify-between border-2 p-2 rounded-md cursor-pointer"
        onClick={handleToggle}
      >
        <h1
          className={`font-semibold ${
            toggle ? "text-blue-600 text-xl" : "text-lg"
          }`}
        >
          {item?.title}
        </h1>
        <img
          className={`h-[15px] w-[15px] transform ${
            toggle ? "rotate-180" : "rotate-0"
          } transition-transform duration-300 cursor-pointer`}
          src={arrowDown}
          alt="Sort Down Icon"
        />
      </div>
      <div
        ref={contentRef}
        style={{
          maxHeight: `${contentHeight}`,
          opacity: toggle ? 1 : 0,
          transition: "max-height 0.3s ease-out, opacity 0.3s ease-out",
        }}
        className="overflow-hidden"
      >
        <div className="flex gap-20 flex-wrap">
          <div>
            <h1 className="font-bold mb-3">Các bộ sách</h1>
            {documentList?.documents?.map((d) => (
              <h1
                key={d.id}
                className="cursor-pointer hover:opacity-85"
                onClick={() => navigate(`/document/${d.id}`)}
              >
                {d.title}
              </h1>
            ))}
            {documentList?.documents?.length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() => navigate(`/search?classId=${item.id}`)}
              >
                Xem tất cả
              </h1>
            )}
          </div>

          <div>
        <h1 className="font-bold mb-3">Câu hỏi ôn tập flashcard</h1>
        {practiceQuizzes.map((d) => (
          <h1
            key={d.id}
            className="cursor-pointer hover:opacity-85"
            onClick={() => navigate(`/flashcard/${d.id}`)}
          >
            {d.title}
          </h1>
        ))}
        {practiceQuizzes.length > 4 && (
          <h1
            className="text-sm text-blue-600 mt-3 cursor-pointer"
            onClick={() => navigate(`/searchquiz`)}
          >
            Xem tất cả
          </h1>
        )}
      </div>

      <div>
        <h1 className="font-bold mb-3">Câu hỏi ôn tập trắc nghiệm</h1>
        {testQuizzes.map((d) => (
          <h1
            key={d.id}
            className="cursor-pointer hover:opacity-85"
            onClick={() => navigate(`/testquiz/${d.id}`)}
          >
            {d.title}
          </h1>
        ))}
        {testQuizzes.length > 4 && (
          <h1
            className="text-sm text-blue-600 mt-3 cursor-pointer"
            onClick={() => navigate(`/searchquiz`)}
          >
            Xem tất cả
          </h1>
        )}
      </div>
    
        
          <div>
            <h1 className="font-bold mb-3">Đề thi</h1>
            {documentList?.exams?.map((exam) => (
              <h1
                key={exam.id}
                className="cursor-pointer hover:opacity-85"
                onClick={() => handleExam(exam)}
              >
                {exam.title}
              </h1>
            ))}
            {documentList?.exams?.length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() => navigate(`/search?classId=${item.id}`)}
              >
                Xem tất cả
              </h1>
            )}
          </div>
          <div>
            <h1 className="font-bold mb-3">Bài tập</h1>
            {documentList?.documents
              ?.flatMap(
                (d) =>
                  d.topics?.flatMap(
                    (t) => t.lessons?.flatMap((l) => l.problems) || []
                  ) || []
              )
              ?.map((problem) => (
                <h1
                  key={problem.id}
                  className="cursor-pointer hover:opacity-85"
                  onClick={() => navigate(`/codeEditor/${problem.id}`)}
                >
                  {problem.title}
                </h1>
              ))}
            {documentList?.documents?.flatMap(
              (d) =>
                d.topics?.flatMap(
                  (t) => t.lessons?.flatMap((l) => l.problems) || []
                ) || []
            )?.length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() => navigate(`/search?classId=${item.id}`)}
              >
                Xem tất cả
              </h1>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
