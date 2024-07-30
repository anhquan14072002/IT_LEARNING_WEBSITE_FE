import React, { useEffect } from "react";
import image from "../../assets/img/image.png";
import message from "../../assets/Icons/message.png";
import { Button } from "primereact/button";
import restClient from "../../services/restClient";
function PostQuestion({ post }) {
  const { content, userName, avatar, createdDate, gradeTitle } = post;
  let contentJsx = <div dangerouslySetInnerHTML={{ __html: content }} />;
  // Format the date to a readable format
  const formattedDate = new Date(createdDate).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  return (
    <div className="border-stone-200 border-b-2 ">
      <div className="rounded p-5 flex flex-col gap-3">
        <p className="flex justify-between items-center">
          <span className="flex gap-3">
            <span className="flex items-center">
              <img
                src={avatar || image}
                alt="Ảnh người dùng"
                width="30px"
                style={{ borderRadius: "25px" }}
              />
            </span>
            <span className="flex flex-col">
              <strong>{userName}</strong>
              <span className="text-sm text-stone-400">
                {/* 12 giờ trước (20:28) - SIT18 */}
                {formattedDate}
              </span>
            </span>
          </span>

          <i
            className="pi pi-search"
            style={{ fontSize: "1.1rem", color: "#708090" }}
          ></i>
        </p>
        <p className="text-xl">{contentJsx}</p>
        <p>
          <Button
            label={`# Tin học ${gradeTitle}`}
            severity="warning"
            style={{ backgroundColor: "#FAA500" }}
            className="text-white px-5 py-2 rounded-3xl"
          />
        </p>
        <p>
          <img src={message} alt="Ảnh tin nhắn" width="24px" />
        </p>
      </div>
    </div>
  );
}

export default PostQuestion;
