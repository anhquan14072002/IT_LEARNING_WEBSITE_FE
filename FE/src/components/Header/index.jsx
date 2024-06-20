import { Button } from "primereact/button";
import React from "react";
import avatar from "../../assets/img/icons8-male-user-50.png";
import arrowDown from "../../assets/img/icons8-sort-down-50.png";
import "./index.css";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";

export default function Header() {
  const navigate = useNavigate();
  return (
    <div className="w-full">
      <div className="bg-[#1976D2] flex justify-between py-4 px-16">
        <div className="flex items-center">
          <img className="h-[30px] w-[30px]" src={avatar} onClick={()=>navigate('/')}/>
        </div>
        <div className="flex">
          {/* search */}
          <div className="border border-white rounded-3xl flex items-center px-2.5 py-2 gap-2.5" onClick={()=>navigate('/search')}>
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
              className="bg-transparent border-none text-white focus:outline-none placeholder:text-white"
            />
          </div>

          {/* not login */}
          <div className="ml-10 px-5 flex gap-5">
            <Button label="Đăng nhập" text raised className="text-white px-3" onClick={()=>navigate('/login')}/>
            <Button label="Đăng kí" severity="warning" style={{backgroundColor:'#FAA500'}} className="text-white px-5" onClick={()=>navigate('/register')}/>
          </div>

          {/* login */}
          {/* <div className="ml-10 flex items-center gap-5 my-auto">
            <div>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                width="30"
                height="30"
                viewBox="0, 0, 300, 150"
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
                  <g transform="scale(5.12, 5.12)">
                    <path d="M25,0c-2.20703,0 -4,1.79297 -4,4c0,2.20703 1.79297,4 4,4c2.20703,0 4,-1.79297 4,-4c0,-2.20703 -1.79297,-4 -4,-4zM19.375,6.09375c-4.57031,1.95703 -7.375,6.36328 -7.375,11.90625c0,11 -3.80078,13.76172 -6.0625,15.40625c-1.00391,0.72656 -1.9375,1.40234 -1.9375,2.59375c0,4.20703 6.28125,6 21,6c14.71875,0 21,-1.79297 21,-6c0,-1.19141 -0.93359,-1.86719 -1.9375,-2.59375c-2.26172,-1.64453 -6.0625,-4.40625 -6.0625,-15.40625c0,-5.55859 -2.80078,-9.95312 -7.375,-11.90625c-0.85547,2.27344 -3.05859,3.90625 -5.625,3.90625c-2.56641,0 -4.76953,-1.63672 -5.625,-3.90625zM19,43.875c0,0.03906 0,0.08594 0,0.125c0,3.30859 2.69141,6 6,6c3.30859,0 6,-2.69141 6,-6c0,-0.03906 0,-0.08594 0,-0.125c-1.88281,0.07813 -3.88281,0.125 -6,0.125c-2.11719,0 -4.11719,-0.04687 -6,-0.125z"></path>
                  </g>
                </g>
              </svg>
            </div>
            <div>
              <div className="ml-2 flex items-center">
                <img className="h-[30px] w-[30px]" src={avatar} />
                <img className="h-[15px] w-[15px]" src={arrowDown} />
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}
