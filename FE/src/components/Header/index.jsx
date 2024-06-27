import React, { useEffect, useState } from "react";
import avatar from "../../assets/img/icons8-male-user-50.png";
import arrowDown from "../../assets/img/icons8-sort-down-50.png";
import "./index.css";
import { Tooltip } from "primereact/tooltip";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { Button } from "primereact/button";

export default function Header({ params, setParams, textSearchProps }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [textSearch, setTextSearch] = useState(textSearchProps);

  const handleKeyDown = (e) => {
    const trimmedText = e.target.value.trim();
    const encodedText = encodeURIComponent(trimmedText);
    console.log("====================================");
    console.log(location.pathname);
    console.log("====================================");

    if (e.key === "Enter") {
      if (location.pathname === "/search") {
        setParams({
          ...Object.fromEntries(params.entries()),
          text: encodedText,
        });
      }
      if (location.pathname !== "/search") {
        navigate(`/search?text=${encodedText}`);
      }
    }
  };

  useEffect(() => {
    setTextSearch(""); 
  }, [textSearchProps]);
  

  return (
    <div className="w-full">
      <div className="bg-[#1976D2] flex justify-between py-4 px-16">
        <div className="flex items-center">
          <img
            className="h-[30px] w-[30px]"
            src={avatar}
            onClick={() => navigate("/")}
          />
        </div>
        <div className="flex">
          <div className="border border-white rounded-3xl flex items-center px-2.5 py-2 gap-2.5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              x="0px"
              y="0px"
              width="22"
              height="22"
              viewBox="0,0,256,256"
              className="fill-white"
            >
              <g
                fillRule="nonzero"
                stroke="none"
                strokeWidth="1"
                strokeLinecap="butt"
                strokeLinejoin="miter"
                strokeMiterlimit="10"
                strokeDasharray=""
                strokeDashoffset="0"
                fontFamily="none"
                fontWeight="none"
                fontSize="none"
                textAnchor="none"
                style={{ mixBlendMode: "normal" }}
              >
                <g transform="scale(5.12,5.12)">
                  <path d="M21,3c-9.37891,0 -17,7.62109 -17,17c0,9.37891 7.62109,17 17,17c3.71094,0 7.14063,-1.19531 9.9375,-3.21875l13.15625,13.125l2.8125,-2.8125l-13,-13.03125c2.55469,-2.97656 4.09375,-6.83984 4.09375,-11.0625c0,-9.37891 -7.62109,-17 -17,-17zM21,5c8.29688,0 15,6.70313 15,15c0,8.29688 -6.70312,15 -15,15c-8.29687,0 -15,-6.70312 -15,-15c0,-8.29687 6.70313,-15 15,-15z"></path>
                </g>
              </g>
            </svg>
            <input
              id="search"
              placeholder="Tìm kiếm"
              value={textSearch}
              className="bg-transparent border-none text-white focus:outline-none placeholder:text-white"
              onChange={(e) => setTextSearch(e.target.value)}
              onKeyDown={(e) => handleKeyDown(e)}
            />
          </div>

          <div className="ml-10 px-5 flex gap-5">
            <Button
              label="Đăng nhập"
              text
              raised
              className="text-white px-3"
              onClick={() => navigate("/login")}
            />
            <Button
              label="Đăng kí"
              severity="warning"
              style={{ backgroundColor: "#FAA500" }}
              className="text-white px-5"
              onClick={() => navigate("/checkmail")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
