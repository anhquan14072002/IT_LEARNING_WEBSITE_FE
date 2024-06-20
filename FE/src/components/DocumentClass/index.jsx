import React from "react";
import "./index.css";

export default function DocumentClass({ display }) {
  return (
    <div className="w-[15%] bg-gray-100 border-r-2 flex flex-col gap-3 min-h-screen pt-5">
      <div
        className={`fixed w-[15%] ${
          display
            ? "transition duration-200 ease-in-out opacity-0"
            : "transition duration-200 ease-in-out opacity-100"
        }`}
      >
        <h1 className="font-bold text-xl pt-2 pl-2">Danh mục các lớp</h1>
        <div className="overflow-y-auto h-[75vh] custom-scrollbar">
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 3
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 4
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 5
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 6
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 7
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 8
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 9
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 10
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 11
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Tài liệu lớp 12
          </div>
        </div>
      </div>
    </div>
  );
}
