import React from "react";
import SideBarImport from "../../components/Quiz/SideBarImport";
import { Outlet } from "react-router-dom";
import Footer from "../../components/Quiz/Footer";
import { FormDataProvider } from "../../store/FormDataContext";

const Menus = [
  { title: "1. Chọn tệp nguồn", index: 0, path: "stepOne" },
  { title: "2. Kiểm tra dữ liệu", index: 1, path: "stepTwo" },
  { title: "3. Kết quả nhập khẩu ", index: 2, path: "stepThree" },
];

function ImportQuiz() {
  return (
    <FormDataProvider>
      <div className="p-5">
        <div className="flex">
          <SideBarImport Menus={Menus} />

          <main className="border border-[#e9eaeb] w-10/12 p-3">
            <Outlet />
          </main>
        </div>
        <Footer Menus={Menus} />
      </div>
    </FormDataProvider>
  );
}

export default ImportQuiz;
