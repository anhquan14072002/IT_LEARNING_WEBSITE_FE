import React from 'react';
import { useNavigate } from 'react-router-dom';

const Index = ({ id,title, type }) => {
    const navigate = useNavigate()
    const handleNavigate =()=>{
        type === 1 ? navigate(`/examdetail/${id}`) : navigate(`/examcodedetail/${id}`)
    }
  return (
    <div className=" mx-auto bg-white w-5/6 shadow-lg rounded-lg overflow-hidden my-2 cursor-pointer" onClick={handleNavigate}>
    <div className="p-4">
      <h2 className="text-xl font-bold text-blue-600">{title}</h2>
      <p className="text-gray-700 mt-2">{type === 1 ? " Tự Luận":" Trắc Nghiệm" }</p>
    </div>
  </div>
  );
};

export default Index;
