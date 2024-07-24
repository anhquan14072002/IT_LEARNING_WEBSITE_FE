import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import ManageCompetition from "../ManageCompetition";

import classNames from "classnames";
import ManageExamCode from "../ManageExamCode";
import ManageExamEssay from "../ManageExamEssay";


export default function ManageExam() {
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
          Cuộc Thi
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 2,
          })}
          onClick={() => setNavIndex(2)}
        >
          Đề Thi Tự Luận
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 3,
          })}
          onClick={() => setNavIndex(3)}
        >
          Đề Thi Trắc Nghiệm
        </h1>
      </div>
      {navIndex === 1 && <ManageCompetition />}
      {navIndex === 2 && <ManageExamEssay />}
      {navIndex === 3 && <ManageExamCode />}
    </div>
  );
}
