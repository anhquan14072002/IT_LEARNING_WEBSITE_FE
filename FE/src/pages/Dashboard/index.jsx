import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ManageDocument from "../../components/ManageDocument";
import { ProgressSpinner } from "primereact/progressspinner";
import LoadingScreen from "../../components/LoadingScreen";
import ContentLesson from "../../components/ContentLesson";
import QuizManagement from "../../components/QuizManagement";
import { Tooltip } from "primereact/tooltip";
import ManageExam from "../../components/ManageExam";
import ManageTag from "../../components/ManageTag";
import ManageAccount from "../../components/ManageAccount";
import { useNavigate, useParams } from "react-router-dom";

import ManageCodeOnline from "../../components/ManageCodeOnline";
import { assets } from "../../assets/assets";
import NotifyProvider from "../../store/NotificationContext";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { typeId } = useParams();
  const user = useSelector((state) => state.user.value);
  const Menus = [
    // Admin specific menus
    ...(user.role === "Admin"
      ? [
          {
            title: "Thống kê",
            src: assets.chart_fill,
            icon: "pi pi-chart-bar",
            index: "statistic",
          },
          {
            title: "Quản lí tài khoản",
            src: assets.user,
            icon: "pi pi-user",
            index: "user",
          },

          {
            title: "Quản lí tài liệu/chủ đề/bài học",
            src: assets.folder,
            icon: "pi pi-book",
            index: "adminManageDocument",
          },
        ]
      : []),

    // Content Manager specific menus
    ...(user.role === "ContentManager"
      ? [
          {
            title: "Quản lí bài học",
            src: assets.folder,
            icon: "pi pi-book",
            index: "lesson",
          },
        ]
      : []),

    // Common menus
    {
      title: "Quản lí câu hỏi ôn tập",
      src: assets.folder,
      icon: "pi pi-question-circle",
      index: "quiz",
    },
    {
      title: "Quản lí đề thi",
      src: assets.folder,
      icon: "pi pi-file",
      index: "test",
    },
    {
      title: "Quản lí tag",
      src: assets.folder,
      icon: "pi pi-tag",
      index: "tag",
    },
    {
      title: "Quản lí bài thực hành",
      src: assets.folder,
      icon: "pi pi-ticket",
      index: "codeeditor",
    },
  ];

  useEffect(() => {
    if (!Menus.some((item, index) => item.index === typeId)) {
      navigate("/notfound");
    }
  }, []);

  return (
    <NotifyProvider>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <>
          <div className="fixed top-0 w-full z-30">
            <Header />
          </div>
          <div className="fixed left-0 top-16 z-20">
            <div
              className={`${
                open ? "w-72" : "w-20"
              } bg-dark-purple h-screen p-5 pt-8 duration-300`}
            >
              <i
                className={`pi pi-arrow-circle-right text-white text-xl  absolute cursor-pointer right-2 top-7 w-7 
   rounded-full ${!open ? "rotate-180" : ""}`}
                onClick={() => setOpen(!open)}
              />

              {/* <div className="flex gap-x-4 items-center">
                <img
                  src="/src/assets/logo.png"
                  className={`cursor-pointer duration-500 ${
                    open ? "rotate-[360deg]" : ""
                  }`}
                />
              </div> */}
              <ul className="pt-6">
                {Menus.map((Menu) => (
                  <li
                    key={Menu.index}
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2 ${
                      Menu.index === Number(typeId) ? "bg-light-white" : ""
                    }`}
                    onClick={() => {
                      navigate(`/dashboard/${Menu.index}`);
                    }}
                  >
                    <Tooltip
                      target={`#tooltip-${Menu.index}`}
                      content={Menu.title}
                    />
                    <i id={`tooltip-${Menu.index}`} className={Menu.icon}></i>

                    <span
                      className={`${
                        !open ? "hidden" : ""
                      } origin-left duration-200`}
                    >
                      {Menu.title}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="ml-20 mt-16 p-7">
            <div className="h-screen" onClick={(e) => setOpen(false)}>
              {typeId === "user" && <ManageAccount />}
              {typeId === "adminManageDocument" && <ManageDocument />}
              {typeId === "lesson" && <ContentLesson />}
              {typeId === "quiz" && <QuizManagement />}
              {typeId === "test" && <ManageExam />}
              {typeId === "tag" && <ManageTag />}
              {typeId === "codeeditor" && <ManageCodeOnline />}
            </div>
          </div>
        </>
      )}
    </NotifyProvider>
  );
};

export default Dashboard;
