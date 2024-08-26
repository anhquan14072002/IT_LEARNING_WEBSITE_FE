import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../StarVoting";
import { Tooltip } from "primereact/tooltip";
import { Tag } from "primereact/tag";

const CustomCard = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/4 px-4 mb-6">
      <div
        className="bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
        onClick={() => navigate(`/document/${document?.id}`)}
      >
        {/* Book Cover Image */}
        <div className="relative h-64 bg-gray-200 rounded-t-lg overflow-hidden">
          {/* Replace this placeholder with actual image if available */}
          <img
            src={document?.image || "https://via.placeholder.com/150"}
            alt={document?.title}
            className="w-full h-full"
          />
        </div>

        {/* Book Title */}
        <div className="p-4">
          {/* Tooltip for Document Title */}
          <Tooltip target=".document-title" />

          <p
            className="text-black text-base font-semibold h-10 overflow-hidden whitespace-nowrap text-ellipsis document-title"
            data-pr-tooltip={document?.title} // Tooltip content for title
            data-pr-position="top"
          >
            {document?.title}
          </p>

          {/* Tooltip for Author */}
          <Tooltip target=".author-tooltip" />

          <p
            className="text-gray-600 text-xs mt-1 truncate author-tooltip"
            data-pr-tooltip={document?.author}
            data-pr-position="top" // Positioning tooltip
          >
            {document?.author || "Unknown Author"}
          </p>
        </div>

        {/* Rating and Reviews */}
        <div className="flex items-center justify-between p-4 border-t border-gray-300">
          <div
            className="flex items-center"
            data-pr-tooltip="Điểm đánh giá và số lượt đánh giá"
            data-pr-position="top"
          >
            <StarRating stars={document?.averageRating} />
            <span className="ml-2 text-gray-600">
              {document?.totalReviewer}
            </span>
          </div>
          <Tooltip target=".flex.items-center" />
        </div>
      </div>
    </div>
  );
};

export default CustomCard;
