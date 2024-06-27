import React from 'react';
import { Rating } from 'primereact/rating';

export default function DocumentCard({ title }) {
  return (
    <div className="bg-white border-2 rounded-lg flex-1 mb-3 cursor-pointer w-full md:w-1/2 lg:w-1/4 px-2">
      <div className="flex flex-col h-full py-11">
        <div className="px-6 pb-4 flex-1">
          <h1 className="font-bold text-xl mb-2 overflow-hidden text-center text-ellipsis">{title}</h1>
        </div>
        <div className="px-6 py-2 flex items-center justify-center">
          <Rating value={5} readOnly cancel={false} />
          <span className="ml-1">(59)</span>
        </div>
      </div>
    </div>
  );
}
