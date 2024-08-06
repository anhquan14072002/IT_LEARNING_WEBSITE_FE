import React from "react";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
const Index = ({ id, title, type }) => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    type === 1
      ? navigate(`/examdetail/${id}`)
      : navigate(`/examcodedetail/${id}`);
  };
  return (
    <div
      className=" mx-auto bg-white w-5/6 shadow-md rounded-lg overflow-hidden my-2 cursor-pointer border border-gray-100"
      onClick={handleNavigate}
    >
      <div className="p-4">
        <div className="flex items-center">
          <i
            className="pi pi-book mr-2"
            style={{ fontSize: "1rem", color: "blue" }}
          ></i>
          <h2 className="text-xl font-bold text-blue-600">{title}</h2>
        </div>
        <div className="flex items-center">
        <i
            className="pi pi-clone mr-2"
            style={{ fontSize: "1rem", color: "gray" }}
          ></i>
        <p className="text-gray-700 mt-2 font-semibold">
          {type === 1 ? " Tự Luận" : " Trắc Nghiệm"}
        </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
