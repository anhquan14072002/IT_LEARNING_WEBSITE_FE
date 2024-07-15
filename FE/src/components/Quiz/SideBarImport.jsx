import { Button } from "primereact/button";
import React, { useState } from "react";
import { NavLink } from "react-router-dom";

function ItemSideBar({ Menu, index, indexMenu }) {
  return (
    <li
      className={`flex p-2 rounded cursor-pointer bg-[#e9eaea] border border-[#c5c7c7] text-sm items-center gap-x-4 
      ${index != 0 ? "mt-2" : ""}${
        index === indexMenu ? "bg-light-white" : ""
      }`}
    >
      <Button disabled className={` origin-left duration-200 opacity-100 `}>
        <NavLink
          to={Menu.path}
          className={({ isActive }) =>
            isActive ? "text-blue-700 font-bold" : undefined
          }
        >
          {Menu.title}
        </NavLink>
      </Button>
    </li>
  );
}
function SideBarImport({ Menus }) {
  const [indexMenu, setIndexMenu] = useState(0);
  return (
    <div className={`w-2/12 bg-[#F5F7F8] min-h-[80vh] pr-2 duration-300`}>
      <ul className=" ">
        {Menus.map((Menu, index) => (
          <ItemSideBar
            key={index}
            Menu={Menu}
            index={index}
            indexMenu={indexMenu}
          />
        ))}
      </ul>
    </div>
  );
}

export default SideBarImport;
