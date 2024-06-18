import React from "react";
import "primeicons/primeicons.css";
import { FcGoogle } from "react-icons/fc";

const index = () => {
  return (
    <div className="flex justify-center">
        <div className="mr-4">
        <FcGoogle style={{width:"50px",height:"40px"}} className="cursor-pointer"  />
        </div>
       <div>
       <img
        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b9/2023_Facebook_icon.svg/2048px-2023_Facebook_icon.svg.png"
        alt=""
        style={{width:"40px",height:"40px"}}
        className="cursor-pointer"
      />
       </div>
      
    </div>
  );
};

export default index;
