import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "primereact/rating";
import { Button } from "primereact/button";

const CustomQuiz = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/3 px-2 mb-4">
      <div
        className="overflow-hidden shadow-lg bg-white border rounded-lg border-gray-300 p-6 cursor-pointer"
        onClick={() => navigate(document?.type === "Practice" ? `/flashcard/${document?.id}` : `/testquiz/${document?.id}`)}
      >
        <div>
          <p className="text-black hover:text-gray-500 text-2xl h-10 overflow-hidden text-ellipsis text-center">
            {document?.title}
          </p>
        </div>
        <div>
          <p className="text-black hover:text-gray-500 text-base h-10 overflow-hidden text-ellipsis text-center">
            {document?.type === "Practice" ? "Ôn tập" : "Kiểm tra"}
          </p>
        </div>
        <div className="flex items-center mt-3">
          <Button
            label={
              document?.type === "Practice" ? "Vào ôn tập" : "Vào kiểm tra"
            }
            className="text-center bg-blue-600 hover:bg-blue-400 text-white w-full mb-2 py-1"
          />
        </div>
      </div>
    </div>
  );
};

export default CustomQuiz;
