import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../StarVoting";
import { Tooltip } from "primereact/tooltip";

const CustomPractice = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-1/3 lg:w-1/4 xl:w-1/3 mb-4 px-5">
      <div
        className="overflow-hidden shadow-lg bg-white border rounded-lg border-gray-300  cursor-pointer py-16"
        onClick={() => navigate(`/codeEditor/${document?.id}`)}
        
      >
        <div>
          <p className="text-center text-black hover:text-gray-500 text-2xl h-10 overflow-hidden text-ellipsis">
            {document?.title}
          </p>
        </div>
        {document?.difficulty === 1 && (
          <div className="mt-3 text-center">
            <span className="bg-yellow-500 text-white rounded-lg p-2">Độ khó:{" "}{document?.difficultyName}</span>
          </div>
        )}
        {document?.difficulty === 2 && (
          <div className="mt-3 text-center">
            <span className="bg-green-500 text-white rounded-lg p-2">Độ khó:{" "}{document?.difficultyName}</span>
          </div>
        )}
        {document?.difficulty === 3 && (
          <div className="mt-3 text-center">
            <span className="bg-red-500 text-white rounded-lg p-2">Độ khó:{" "}{document?.difficultyName}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomPractice;
