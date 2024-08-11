import { Button } from "primereact/button";
import React, { useContext, useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import FormDataContext from "../../store/FormDataContext";

function ItemSideBar({ Menu, index, indexMenu, step }) {
  // neeus step bawng step step cua Menu.pah thif cho bg nen
  let bgStep =
    "flex p-2 rounded cursor-pointer bg-[#e9eaea] border border-[#c5c7c7] text-sm items-center gap-x-4 ";
  console.log(Menu.path.includes(step));

  if (Menu.path.includes(step)) {
    console.log(Menu.path);

    bgStep += " bg-blue-500";
  }
  console.log(index, indexMenu);

  return (
    <li
      className={`${bgStep}
      ${index != 0 ? "mt-2 " : ""}${
        !Menu.path.includes(step) ? "  bg-light-white" : ""
      }`}
    >
      <Button disabled className="origin-left duration-200 opacity-100">
        <NavLink
          to={Menu.path}
          className={({ isActive }) =>
            isActive ? "text-white font-bold" : undefined
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
  const { setStep, step } = useContext(FormDataContext);

  const location = useLocation();

  useEffect(() => {
    setStep(location.pathname.split("/")[2]);
  }, [location]);

  return (
    <div className={`w-2/12 bg-[#F5F7F8] min-h-[80vh] pr-2 duration-300`}>
      <ul className=" ">
        {Menus.map((Menu, index) => (
          <ItemSideBar
            key={index}
            Menu={Menu}
            index={index}
            indexMenu={indexMenu}
            step={step}
          />
        ))}
      </ul>
    </div>
  );
}

export default SideBarImport;
