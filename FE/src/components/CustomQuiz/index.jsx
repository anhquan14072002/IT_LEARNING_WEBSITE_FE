import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "primereact/button";
import { Tooltip } from "primereact/tooltip";

const CustomQuiz = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-49p lg:w-32p xl:w-24p px-4 mb-6">
      <div
        className="bg-blue-50 border border-gray-300 rounded-lg shadow-md p-6 cursor-pointer transform transition-transform duration-300 hover:scale-105 hover:shadow-lg"
        onClick={() =>
          navigate(
            document?.typeId === 1
              ? `/flashcard/${document?.id}`
              : `/testquiz/${document?.id}`
          )
        }
      >
        <div className="text-center mb-4">
          <Tooltip target=".document-title" />
          <p
            className="text-black text-2xl font-semibold h-16 overflow-hidden text-ellipsis document-title"
            data-pr-tooltip={document?.title} // Tooltip content for title
          >
            {document?.title}
          </p>
        </div>
        <div className="text-center mb-4">
          <p className="text-gray-700 text-base font-medium">
            {document?.typeId === 1 ? "Ôn tập" : "Kiểm tra"}
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <Button
            label={document?.typeId === 1 ? "Vào ôn tập" : "Vào kiểm tra"}
            className={`w-full py-2 font-medium rounded-lg transition-colors duration-300 ${
              document?.typeId === 1
                ? "bg-blue-600 hover:bg-blue-500 text-white"
                : "bg-green-600 hover:bg-green-500 text-white"
            }`}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomQuiz;
