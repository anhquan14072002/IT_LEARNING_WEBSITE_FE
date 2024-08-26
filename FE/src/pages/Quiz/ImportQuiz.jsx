import React, { useContext } from "react";
import SideBarImport from "../../components/Quiz/SideBarImport";
import { Outlet, useParams } from "react-router-dom";
import Footer from "../../components/Quiz/Footer";
import FormDataContext, { FormDataProvider } from "../../store/FormDataContext";
import Header from "../../components/Header";
import NotifyProvider from "../../store/NotificationContext";

function ImportQuiz() {
  return (
    <NotifyProvider>
      <FormDataProvider>
        <ImportQuizForm />
      </FormDataProvider>
    </NotifyProvider>
  );
}
function ImportQuizForm() {
  const { id } = useParams();
  const { quizId } = useContext(FormDataContext);
  const Menus = [
    { title: "1. Chọn tệp nguồn", index: 0, path: `stepOne/${id || quizId}` },
    { title: "2. Kiểm tra dữ liệu", index: 1, path: "stepTwo" },
    { title: "3. Kết quả nhập khẩu ", index: 2, path: "stepThree" },
  ];
  return (
    <>
      <Header />
      <div className="p-5">
        <div className="flex">
          <SideBarImport Menus={Menus} />

          <main className="border border-[#e9eaeb] w-10/12 p-3">
            <Outlet />
          </main>
        </div>
        <Footer Menus={Menus} />
      </div>
    </>
  );
}

export default ImportQuiz;
