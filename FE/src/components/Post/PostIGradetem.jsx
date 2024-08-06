import React from "react";

function PostGradeItem({ item, active, ...props }) {
  let bgItemGrade =
    "mt-4 flex gap-3 items-center  border-2 p-2 rounded-md cursor-pointer ";
  let textItemGrade = "text-blue-600 text-xl",
    colorIcon = "blue";

  if (active) {
    bgItemGrade += "bg-[#1976D2]";
    colorIcon = "white";
    textItemGrade = "text-white text-xl";
  }
  return (
    <div className={bgItemGrade} {...props}>
      {/* <i className="pi-circle"></i> */}
      <i
        className="pi pi-circle"
        style={{ color: colorIcon, fontSize: "0.8rem" }}
      ></i>
      <h1 className={textItemGrade}>{item?.title}</h1>
    </div>
  );
}

export default PostGradeItem;
