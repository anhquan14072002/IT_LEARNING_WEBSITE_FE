// import React from 'react';
// import { Rating } from 'primereact/rating';
// import { useNavigate } from 'react-router-dom';
// import StarRating from '../StarVoting';

// export default function DocumentCard({ document }) {
//   const navigate = useNavigate();
//   return (
//     <div className="bg-white border-2 rounded-lg mb-3 cursor-pointer w-full sm:w-49p md:w-32p lg:w-24p xl:w-18p px-2" onClick={()=>navigate(`/document/${document?.id}`)}>
//       <div className="flex flex-col h-full py-11">
//         <div className="px-6 pb-4 flex-1">
//           <h1 className="font-bold text-xl mb-2 overflow-hidden text-center text-ellipsis">{document?.title}</h1>
//         </div>
//         <div className="px-6 py-2 flex items-center justify-center">
//           <StarRating stars={document?.averageRating}  />
//           <span className="ml-1">{document?.totalReviewer}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

import React from "react";
import { useNavigate } from "react-router-dom";
import StarRating from "../StarVoting";
import { Tooltip } from "primereact/tooltip";

const CustomCard = ({ document }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full sm:w-49p md:w-49p lg:w-24p xl:w-18p px-2 mb-10">
      <div
        className="bg-white border border-gray-300 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer transform hover:scale-105"
        onClick={() => navigate(`/document/${document?.id}`)}
      >
        {/* Book Cover Image */}
        <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
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
            className="text-black text-2xl font-semibold h-16 overflow-hidden whitespace-nowrap text-ellipsis document-title"
            data-pr-tooltip={document?.title} // Tooltip content for title
            data-pr-position="top" // Positioning tooltip
          >
            {document?.title}
          </p>

          {/* Tooltip for Author */}
          <Tooltip target=".author-tooltip" />

          <p
            className="text-gray-600 text-sm mt-1 truncate author-tooltip"
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
