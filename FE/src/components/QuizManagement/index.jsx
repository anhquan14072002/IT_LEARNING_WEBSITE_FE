import React, { useState } from "react";
import Topic from "../Topic";
import Lesson from "../Lesson";
import classNames from "classnames";
import ManagementQuizLesson from "../ManagementQuizLesson";
import ManageQuestionQuiz from "../ManageQuestionQuiz";
import ManageCustomQuiz from "../ManageCustomQuiz";

export default function QuizManagement() {
  const [navIndex, setNavIndex] = useState(1);

  return (
    <div>
      {/* menubar */}
      <div className="flex justify-start border-b-2 mb-5 border-[#D1F7FF]">
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 1,
          })}
          onClick={() => setNavIndex(1)}
        >
          Bộ câu hỏi
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 2,
          })}
          onClick={() => setNavIndex(2)}
        >
          Bộ câu hỏi theo chủ đề , bài học
        </h1>
      </div>
      {navIndex === 1 && <ManageCustomQuiz />}
      {navIndex === 2 && <ManagementQuizLesson />}
      {/* {navIndex === 2 && <ManageQuestionQuiz />} */}
    </div>
  );
}
