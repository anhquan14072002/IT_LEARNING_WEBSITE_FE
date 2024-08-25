import React from "react";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "primereact/tooltip";

const CustomPracticeInTag = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-49p lg:w-32p xl:w-24p mb-4 p-4">
      <div
        className="overflow-hidden shadow-lg bg-white border border-gray-300 rounded-lg cursor-pointer py-5 bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 transform transition-transform duration-300 hover:scale-105"
        onClick={() => navigate(`/codeEditor/${document?.id}`)}
      >
        <div className="text-center mb-4">
          <p className="text-black hover:text-gray-600 text-2xl font-semibold h-10 overflow-hidden whitespace-nowrap text-ellipsis">
            {document?.title}
          </p>
        </div>
        <div className="flex justify-center mb-4">
          {document?.difficulty === 1 && (
            <span className="text-green-500 rounded-lg p-2 text-base font-mono bg-green-100 border border-green-200">
              Dễ
            </span>
          )}
          {document?.difficulty === 2 && (
            <span className="text-yellow-500 rounded-lg p-2 text-base font-mono bg-yellow-100 border border-yellow-200">
              Trung bình
            </span>
          )}
          {document?.difficulty === 3 && (
            <span className="text-red-500 rounded-lg p-2 text-base font-mono bg-red-100 border border-red-200">
             Khó
            </span>
          )}
        </div>
        <div className="flex justify-center">
          <div className="bg-green-500 hover:bg-green-400 text-white rounded-lg p-2 text-base font-semibold cursor-pointer transition-colors duration-300">
            Vào làm
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomPracticeInTag;
