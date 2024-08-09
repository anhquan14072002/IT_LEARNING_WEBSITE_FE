import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../StarVoting";
import { Tooltip } from "primereact/tooltip";

const CustomCard = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full md:w-1/2 lg:w-1/3 xl:w-1/2 px-2 mb-4">
      <div
        className="overflow-hidden shadow-lg bg-white border rounded-lg border-gray-300 p-6 cursor-pointer"
        onClick={() => navigate(`/document/${document?.id}`)}
      >
        <div>
          <p className="text-black hover:text-gray-500 text-2xl h-10 overflow-hidden text-ellipsis">
            {document?.title}
          </p>
        </div>
        <div
          className="flex items-center mt-3"
          data-pr-tooltip="Điểm đánh giá và số lượt đánh giá"
          data-pr-position="top"
        >
          <StarRating stars={document?.averageRating} />
          <span className="ml-1 text-gray-600">{document?.totalReviewer}</span>
        </div>
        <Tooltip target=".flex.items-center.mt-3" />
      </div>
    </div>
  );
};

export default CustomCard;
