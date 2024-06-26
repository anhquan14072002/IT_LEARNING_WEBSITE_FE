import { Rating } from "primereact/rating";
import React from "react";

export default function CustomCard({document}) {
  
  return (
    <div className="overflow-hidden shadow-lg bg-white border rounded-lg border-gray-300 m-4 p-6 cursor-pointer">
      <div>
        <p className="text-black hover:text-gray-500 text-2xl">{document?.title}</p>
      </div>
      <div className="flex items-center mt-5">
        <Rating value={5} readOnly cancel={false} />
        <span className="ml-1">(59)</span>
      </div>
    </div>
  );
}
