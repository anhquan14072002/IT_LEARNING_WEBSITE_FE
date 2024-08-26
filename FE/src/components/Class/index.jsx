import React, { useState, useRef, useEffect } from "react";
import arrowDown from "../../assets/img/icons8-arrow-down-50.png";
import { getDocumentByGradeId } from "../../services/document.api";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Tooltip } from "primereact/tooltip";

export default function Class({ item, index }) {
  const [toggle, setToggle] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("0px");
  const [loading, setLoading] = useState(false);
  const [documentList, setDocumentList] = useState([]);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.value);

  // useEffect(() => {
  //   if (toggle) {
  //     getDocumentByGradeId(item.id, setLoading, setDocumentList);
  //   }
  // }, [toggle, item.id]);

  useEffect(() => {
    if (toggle) {
      setLoading(true);
      getDocumentByGradeId(item.id, setLoading, setDocumentList);
    } else {
      setContentHeight("0px");
    }
  }, [toggle, item.id]);

  useEffect(() => {
    setContentHeight(`${contentRef.current.scrollHeight}px`);
  }, [documentList]);

  useEffect(() => {
    setTimeout(() => {
      const updateContentHeight = () => {
        setContentHeight(
          toggle ? `${contentRef?.current?.scrollHeight}px` : "0px"
        );
      };
      updateContentHeight();
      window.addEventListener("resize", updateContentHeight);
      return () => {
        window.removeEventListener("resize", updateContentHeight);
      };
    }, 300);
  }, [toggle]);

  const handleToggle = () => {
    setToggle((prevToggle) => !prevToggle);
  };

  const extractQuizzesByType = (typeId) => {
    const quizzesCustom = (documentList?.quizzesCustom ?? []).filter(
      (q) => q.typeId === typeId
    );

    const quizzesFromDocuments = (documentList?.documents ?? []).flatMap(
      (d) => [
        ...(d.topics ?? []).flatMap((t) => [
          ...(t.quizzes ?? []).filter((q) => q.typeId === typeId),
          ...(t.lessons ?? []).flatMap((l) =>
            (l.quizzes ?? []).filter((q) => q.typeId === typeId)
          ),
        ]),
      ]
    );

    return [...quizzesCustom, ...quizzesFromDocuments];
  };

  const practiceQuizzes = extractQuizzesByType(1);
  const testQuizzes = extractQuizzesByType(2);

  const handleExam = (exam) => {
    if (user?.sub) {
      exam?.type === 1
        ? navigate(`/examdetail/${exam.id}`)
        : navigate(`/examcodedetail/${exam.id}`);
    } else {
      const confirmed = window.confirm("Vui lòng đăng nhập để được xem đề thi");
      if (confirmed) {
        navigate("/login");
      }
    }
  };

  const getAllProblems = (data) => {
    if (!data || typeof data !== "object") {
      console.error("Expected data to be an object with an array of documents");
      return [];
    }

    const documents = Array.isArray(data.documents) ? data.documents : [];

    const problemsCustom = Array.isArray(data.problemsCustom)
      ? data.problemsCustom
      : [];

    const problemsFromDocuments = documents.flatMap((item) =>
      (Array.isArray(item.topics) ? item.topics : []).flatMap((topic) =>
        (Array.isArray(topic.problems) ? topic.problems : []).concat(
          (Array.isArray(topic.lessons) ? topic.lessons : []).flatMap(
            (lesson) => (Array.isArray(lesson.problems) ? lesson.problems : [])
          )
        )
      )
    );

    return [...problemsCustom, ...problemsFromDocuments];
  };

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
        className="flex gap-5 flex-wrap overflow-hidden"
      >
        <div className="flex gap-20 flex-wrap">
          <div>
            <h1 className="font-bold mb-3">Các bộ sách</h1>
            {(documentList?.documents ?? [])
              .map((d, index) => (
                <>
                  <Tooltip target={`.tooltip-lesson-${index}`} />
                  <h1
                    key={d?.id}
                    className={`cursor-pointer hover:opacity-85 overflow-hidden whitespace-nowrap text-ellipsis `}
                    style={{ width: "200px" }} // Fixed width
                    onClick={() => navigate(`/document/${d?.id}`)}
                  >
                    <span
                      className={`tooltip-lesson-${index}`}
                      data-pr-tooltip={d?.title}
                      data-pr-position="top" // Positioning tooltip
                    >
                      {d?.title}
                    </span>
                  </h1>
                </>
              ))
              .slice(0, 4)}
            {(documentList?.documents ?? []).length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() => navigate(`/search?classId=${item?.id}`)}
              >
                Xem tất cả
              </h1>
            )}
          </div>

          <div>
            <h1 className="font-bold mb-3">Câu hỏi ôn tập flashcard</h1>
            {practiceQuizzes
              .map((d, index) => (
                <>
                  <Tooltip target={`.tooltip-flashcard-${index}`} />
                  <h1
                    key={d?.id}
                    className={`cursor-pointer hover:opacity-85 overflow-hidden whitespace-nowrap text-ellipsis tooltip-flashcard-${index}`}
                    style={{ width: "200px" }} // Fixed width
                    onClick={() => navigate(`/flashcard/${d?.id}`)}
                  >
                    <span
                      className={`tooltip-flashcard-${index}`}
                      data-pr-tooltip={d?.title}
                      data-pr-position="top" // Positioning tooltip
                    >
                      {d?.title}
                    </span>
                  </h1>
                </>
              ))
              .slice(0, 4)}
            {practiceQuizzes?.length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() =>
                  navigate(`/searchquiz?type=1&classId=${item?.id}`)
                }
              >
                Xem tất cả
              </h1>
            )}
          </div>

          <div>
            <h1 className="font-bold mb-3">Câu hỏi ôn tập trắc nghiệm</h1>
            {testQuizzes
              ?.map((d) => (
                <>
                  <Tooltip target={`.tooltip-flashcardTest-${index}`} />
                  <h1
                    key={d?.id}
                    className={`cursor-pointer hover:opacity-85 overflow-hidden whitespace-nowrap text-ellipsis tooltip-flashcardTest-${index}`}
                    style={{ width: "200px" }}
                    onClick={() => navigate(`/testquiz/${d.id}`)}
                  >
                    <span
                      className={`tooltip-flashcardTest-${index}`}
                      data-pr-tooltip={d?.title}
                      data-pr-position="top" // Positioning tooltip
                    >
                      {d?.title}
                    </span>
                  </h1>
                </>
              ))
              .slice(0, 4)}
            {testQuizzes.length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() =>
                  navigate(`/searchquiz?type=2&classId=${item?.id}`)
                }
              >
                Xem tất cả
              </h1>
            )}
          </div>

          <div>
            <h1 className="font-bold mb-3">Đề thi</h1>
            {(documentList?.exams ?? [])
              .map((exam, index) => (
                <h1
                  key={exam?.id}
                  className={`cursor-pointer hover:opacity-85 overflow-hidden whitespace-nowrap text-ellipsis tooltip-exam-${index}`}
                  style={{ width: "200px" }} // Fixed width
                  onClick={() => handleExam(exam)}
                >
                  <Tooltip target={`.tooltip-exam-${index}`} />
                  <span
                    className={`tooltip-exam-${index}`}
                    data-pr-tooltip={exam?.title}
                    data-pr-position="top" // Positioning tooltip
                  >
                    {exam?.title}
                  </span>
                </h1>
              ))
              .slice(0, 4)}
            {(documentList?.exams ?? []).length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() => navigate(`/viewexam`)}
              >
                Xem tất cả
              </h1>
            )}
          </div>

          <div>
            <h1 className="font-bold mb-3">Bài tập</h1>
            {getAllProblems(documentList)
              .map((problem) => (
                <h1
                  key={problem?.id}
                  className={`cursor-pointer hover:opacity-85 overflow-hidden whitespace-nowrap text-ellipsis tooltip-problem-${index}`}
                  style={{ width: "200px" }} // Fixed width
                  onClick={() => navigate(`/codeEditor/${problem?.id}`)}
                >
                  <Tooltip target={`.tooltip-problem-${index}`} />
                  <span
                    className={`tooltip-problem-${index}`}
                    data-pr-tooltip={problem?.title}
                  >
                    {problem?.title}
                  </span>
                </h1>
              ))
              .slice(0, 4)}
            {getAllProblems(documentList).length > 4 && (
              <h1
                className="text-sm text-blue-600 mt-3 cursor-pointer"
                onClick={() => navigate(`/listpractice?classId=${item?.id}`)}
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
