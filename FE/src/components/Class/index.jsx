import React, { useState, useRef, useEffect } from "react";
import arrowDown from "../../assets/img/icons8-arrow-down-50.png";
import { getDocumentByGradeId } from "../../services/document.api";
import { useNavigate } from "react-router-dom";

export default function Class({ item }) {
  const [toggle, setToggle] = useState(false);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState("0px");
  const [loading,setLoading] = useState(false);
  const [documentList,setDocumentList] = useState([]);
  const navigate = useNavigate()

  function handleToggle() {
    setToggle(!toggle);
    setContentHeight(toggle ? "0px" : `${contentRef.current.scrollHeight}px`);
  }

  useEffect(()=>{
    if(toggle){
      getDocumentByGradeId(item.id,setLoading,setDocumentList)
    }
  },[toggle])

  return (
    <div>
      <div
        className="mt-4 flex items-center justify-between border-2 p-2 rounded-md"
        onClick={handleToggle}
      >
        <h1 className="font-semibold text-lg">{item?.title}</h1>
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
        <div className="flex items-start gap-20 flex-wrap">
          <div>
            <h1 className="font-bold mb-3">Đề thi</h1>
            <h1>Đề thi 1</h1>
            <h1>Đề thi 2</h1>
            <h1>Đề thi 3</h1>
            <h1>Đề thi 3</h1>
            <h1 className="text-sm text-blue-600 mt-3">Xem tất cả</h1>
          </div>
          <div>
            <h1 className="font-bold mb-3">Bài tập</h1>
            <h1>Bài tập 1</h1>
            <h1>Bài tập 2</h1>
            <h1>Bài tập 3</h1>
            <h1>Bài tập 3</h1>
            <h1 className="text-sm text-blue-600 mt-3 cursor-pointer">
              Xem tất cả
            </h1>
          </div>
          <div>
            <h1 className="font-bold mb-3">Tài liệu</h1>
            {documentList && documentList.map((d,i)=>
              <h1 className="cursor-pointer hover:opacity-85" onClick={()=>navigate(`/document/${d?.id}`)}>{d?.title}</h1>
            )}
            {documentList && documentList.length > 4 && (
              <h1 className="text-sm text-blue-600 mt-3 cursor-pointer">
                Xem tất cả
              </h1>
            )}
          </div>
          <div>
            <h1 className="font-bold mb-3">Câu hỏi ôn tập</h1>
            <h1>Câu hỏi ôn tập 1</h1>
            <h1>Câu hỏi ôn tập 2</h1>
            <h1>Câu hỏi ôn tập 3</h1>
            <h1>Câu hỏi ôn tập 3</h1>
            <h1 className="text-sm text-blue-600 mt-3 cursor-pointer">
              Xem tất cả
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
