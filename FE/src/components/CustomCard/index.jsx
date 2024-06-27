import React from "react";
import { useNavigate } from "react-router-dom";
import { Rating } from "primereact/rating";

export default function CustomCard({ document }) {
  const navigate = useNavigate();

  return (
    <div
      className="overflow-hidden shadow-lg bg-white border rounded-lg border-gray-300 m-4 p-6 cursor-pointer"
      onClick={() => navigate(`/document/${document?.id}`)}
    >
      <div>
        <p className="text-black hover:text-gray-500 text-2xl h-[2rem] overflow-hidden text-ellipsis w-full">
          {document?.title}
        </p>
      </div>
      <div className="flex items-center mt-5">
        <Rating value={5} readOnly cancel={false} />
        <span className="ml-1">(59)</span>
      </div>
    </div>
  );
}
