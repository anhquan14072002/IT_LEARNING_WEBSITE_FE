import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Footer from "../../components/Footer";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function NotFound() {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);

  useEffect(() => {
    setTimeout(()=>{
        if (fixedDivRef.current) {
            setFixedDivHeight(fixedDivRef.current.offsetHeight);
          }
    },500)
  }, [fixedDivRef]);

  return (
    <div className="min-h-screen flex flex-col">
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
      </div>
      <div style={{ paddingTop: `${fixedDivHeight}px` }} className="">
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="text-center">
        <div className="text-8xl font-extrabold text-red-600 mb-6">
          404
        </div>
        <p className="text-2xl text-gray-700 mb-8">
          Trang không tồn tại
        </p>
        <Link to="/" className="inline-block px-8 py-4 text-white bg-blue-500 rounded-lg text-xl font-semibold hover:bg-blue-600 transition">
          Trở về trang chủ
        </Link>
      </div>
    </div>
      </div>

      <Footer/>
    </div>
  );
}
