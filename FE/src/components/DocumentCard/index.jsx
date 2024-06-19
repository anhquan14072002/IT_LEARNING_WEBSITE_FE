import React from 'react'
import kidImg from "../../assets/img/kv6e_1tem_210901.jpg";
import { Rating } from "primereact/rating";

export default function DocumentCard() {
  return (
    <div className="bg-white border-2 w-[350px] rounded-sm flex-1">
            <img
              className="h-[200px] w-full cursor-pointer object-cover"
              src={kidImg}
              alt="Kid"
            />
            <div className="px-6 py-4">
              <h1 className="font-bold text-xl mb-2">Tài liệu tin học Java</h1>
              <Rating value={5} readOnly cancel={false} />
            </div>
          </div>
  )
}
