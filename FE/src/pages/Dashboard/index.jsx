import { useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import ManageDocument from "../../components/ManageDocument";

const Dashboard = () => {
  const [open, setOpen] = useState(true);
  const [indexMenu, setIndexMenu] = useState(0);
  const Menus = [
    { title: "Thống kê", src: "Chart_fill", index: 0 },
    { title: "Quản lí tài khoản", src: "User", index: 1 },
    { title: "Quản lí tài liệu/chủ đề/bài học ", src: "Folder", index: 2 },
  ];

  return (
    <>
      <Header />
      <div className="flex">
        <div
          className={` ${
            open ? "w-72" : "w-20 "
          } bg-dark-purple h-screen p-5  pt-8 relative duration-300`}
        >
          <img
            src="./src/assets/control.png"
            className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
           border-2 rounded-full  ${!open && "rotate-180"}`}
            onClick={() => setOpen(!open)}
          />
          <div className="flex gap-x-4 items-center">
            <img
              src="./src/assets/logo.png"
              className={`cursor-pointer duration-500 ${
                open && "rotate-[360deg]"
              }`}
            />
          </div>
          <ul className="pt-6">
            {Menus.map((Menu, index) => (
              <li
                key={index}
                className={`flex  rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 mt-2
              ${index === indexMenu && "bg-light-white"} `}
              onClick={()=>setIndexMenu(index)}
              >
                <img src={`./src/assets/${Menu.src}.png`} />
                <span
                  className={`${!open && "hidden"} origin-left duration-200`}
                >
                  {Menu.title}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="h-screen flex-1 p-7">
          {indexMenu === 2 ? <ManageDocument /> : null}
        </div>
      </div>
    </>
  );
};
export default Dashboard;
