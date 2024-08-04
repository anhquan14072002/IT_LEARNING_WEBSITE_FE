import React, { useEffect, useRef, useState } from "react";
import "./index.css";
import classNames from "classnames";
import ManageAdmin from "./ManageAdmin";
import ManageUser from "./ManageUser";


export default function ManageAccount() {
  const [navIndex, setNavIndex] = useState(1);

  return (
    <div>
      <div className="flex justify-start border-b-2 mb-5 border-[#D1F7FF]">
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 1,
          })}
          onClick={() => setNavIndex(1)}
        >
          Quản trị viên
        </h1>
        <h1
          className={classNames("p-5 cursor-pointer hover:bg-[#D1F7FF]", {
            "bg-[#D1F7FF] font-bold": navIndex === 2,
          })}
          onClick={() => setNavIndex(2)}
        >
          Người dùng
        </h1>
      </div>
      {navIndex === 1 && <ManageAdmin />}
      {navIndex === 2 && <ManageUser />}
    </div>
  );
}
