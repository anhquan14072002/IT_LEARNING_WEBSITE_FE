import React from "react";
import './index.css'

export default function LessonInDocument({ display }) {
  return (
    <div className="w-[15%] bg-gray-100 border-r-2 flex flex-col gap-3 min-h-screen pt-5">
      <div
        className={`fixed w-[15%] ${
          display
            ? "transition duration-200 ease-in-out opacity-0"
            : "transition duration-200 ease-in-out opacity-100"
        } `}
      >
        <h1 className="font-bold text-xl pt-2 pl-2">Java cơ bản</h1>
        <div className="overflow-y-auto h-[75vh] custom-scrollbar"> {/* Adjust height as needed */}
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 1 {/* Ensure each item has a unique text */}
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 2
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 3
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 11
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 12
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 1 {/* Ensure each item has a unique text */}
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 2
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 3
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 11
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 12
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 1 {/* Ensure each item has a unique text */}
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 2
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 3
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 11
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 12
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 1 {/* Ensure each item has a unique text */}
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 2
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 3
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 11
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 12
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 1 {/* Ensure each item has a unique text */}
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 2
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 3
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 11
          </div>
          <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
            Java cơ bản 12
          </div>
        </div>
      </div>
    </div>
  );
}
