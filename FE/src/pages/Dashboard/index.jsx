import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ManageDocument from "../../components/ManageDocument";
import { ProgressSpinner } from "primereact/progressspinner";
import LoadingScreen from "../../components/LoadingScreen";
import TopicList from "../../components/ManagementTopic/TopicList";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [indexMenu, setIndexMenu] = useState(0);
  const [loading, setLoading] = useState(true);

  const Menus = [
    { title: "Thống kê", src: "Chart_fill", index: 0 },
    { title: "Quản lí tài khoản", src: "User", index: 1 },
    { title: "Quản lí tài liệu/chủ đề/bài học ", src: "Folder", index: 2 },
    {
      title: "Quản lí chủ đề ",
      src: "Folder",
      index: 3,
      component: <TopicList />,
    },
  ];

  return (
    <>
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
              <img
                src="/src/assets/control.png"
                className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
               border-2 rounded-full ${!open ? "rotate-180" : ""}`}
                onClick={() => setOpen(!open)}
              />
              <div className="flex gap-x-4 items-center">
                <img
                  src="/src/assets/logo.png"
                  className={`cursor-pointer duration-500 ${
                    open ? "rotate-[360deg]" : ""
                  }`}
                />
              </div>
              <ul className="pt-6">
                {Menus.map((Menu, index) => (
                  <li
                    key={index}
                    className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2 ${
                      index === indexMenu ? "bg-light-white" : ""
                    }`}
                    onClick={() => setIndexMenu(index)}
                  >
                    <img src={`/src/assets/${Menu.src}.png`} />
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
          <div className={`ml-20 mt-16 p-7`}>
            <div className="h-screen">
              {indexMenu === 2 && <ManageDocument />}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Dashboard;
