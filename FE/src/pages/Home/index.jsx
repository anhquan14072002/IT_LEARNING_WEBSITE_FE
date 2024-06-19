import React from "react";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import arrowDown from "../../assets/img/icons8-arrow-down-50.png";
import Class from "../../components/Class";
import DocumentCard from "../../components/DocumentCard";
import Footer from "../../components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <div className="fixed top-0 w-full z-10">
        <Header />
        <Menu />
      </div>
      <div className="px-20 mt-32">
        <h1 className="mt-10 text-2xl font-bold">
          Danh mục bài tập và soạn bài
        </h1>
        <div>
          {[...Array(10).keys()].map((_, i) => {
            const index = i + 3;
            return <Class classNumber={index} />;
          })}
        </div>
      </div>
      <div className="px-20 mt-16 mb-10">
        <h1 className="mt-10 text-2xl font-bold">
          Tài liệu online cho giáo viên và học sinh
        </h1>
        <div className="my-5 flex justify-between">
          <h1 className="text-gray-500">Dành cho các học sinh từ lớp 1-12</h1>
          <h1 className="text-blue-500 cursor-pointer">
            &gt;&gt; Xem tất cả khóa học
          </h1>
        </div>
        <div className="flex flex-wrap justify-between gap-3">
          <DocumentCard />
          <DocumentCard />
          <DocumentCard />
        </div>
      </div>
      <Footer />
    </div>
  );
}
