import React from "react";

export default function CategoryOfClass({ display }) {
  return (
    <div className="w-[15%] bg-gray-100 border-r-2 flex flex-col gap-3 min-h-screen -z-10 pt-5">
      <div
        className={`fixed w-[15%] ${
          display
            ? "transition duration-200 ease-in-out opacity-0"
            : "transition duration-200 ease-in-out opacity-100"
        }`}
      >
        <h1 className="font-bold text-xl pt-2 pl-2">Danh mục các lớp</h1>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 3
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 4
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 5
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 6
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 7
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 8
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 9
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 10
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 11
        </div>
        <div className="hover:bg-[#D1F7FF] p-2 cursor-pointer w-full">
          Lớp 12
        </div>
      </div>
    </div>
  );
}
