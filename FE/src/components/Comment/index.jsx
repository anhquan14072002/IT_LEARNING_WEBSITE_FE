import React, { useState } from "react";
import avatar from "../../assets/logo.png";
import { Avatar } from "primereact/avatar";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";

const commentsData = [
  {
    user: { avatar: avatar, name: "John Doe" },
    createdAt: new Date().toISOString(),
    rating: 4,
    content: "This is a great product!",
  },
  {
    user: { avatar: avatar, name: "Jane Smith" },
    createdAt: new Date().toISOString(),
    rating: 5,
    content: "Absolutely love this!",
  },
  // Add more comments as needed
];

export default function Comment() {
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(null);

  return (
    <div className="py-20">
      <h1 className="font-bold text-center">Phần đánh giá</h1>
      <div className="flex justify-center mt-4">
        <Avatar
          image={avatar}
          size="xlarge"
          shape="circle"
          className="border border-gray-300"
        />
      </div>

      {/* Comment Editor */}
      <div className="mt-10 border border-solid border-gray-300 p-4 rounded-xl">
        <h2 className="font-bold mb-4">
          Nhập đánh giá của bạn về bộ tài liệu này
        </h2>
        <Rating
          value={newRating}
          onChange={(e) => setNewRating(e.value)}
          stars={5}
          className="mb-4"
        />
        <Editor
          value={newComment}
          onTextChange={(e) => setText(e.htmlValue)}
          style={{ height: "250px" }}
        />
        <Button
          label="Gửi"
          icon="pi pi-send"
          className="bg-blue-600 p-2 text-white 
        "
        />
      </div>

      {/* Comments List */}
      <div className="mt-10">
        {comments.map((comment, index) => (
          <div className="flex gap-5 items-center mt-5" key={index}>
            <div>
              <Avatar
                image={comment.user.avatar}
                size="large"
                shape="circle"
                className="border border-gray-300"
              />
            </div>
            <div className="border border-solid border-gray-300 p-4 rounded-xl w-full">
              <div className="flex gap-5">
                <div>
                  <p className="font-bold">{comment.user.name}</p>
                </div>
                <div>
                  <p className="text-gray-500 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="16"
                      width="14"
                      viewBox="0 0 448 512"
                    >
                      <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z" />
                    </svg>
                    &nbsp;{new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="my-2">
                <Rating
                  value={comment.rating}
                  readOnly
                  stars={5}
                  cancel={false}
                  className="shadow-none"
                />
              </div>
              <div>
                <p>{comment.content}</p>
              </div>
            </div>
          </div>
        ))}
        {comments.length === 0 && (
          <div className="my-16">
            <p className="text-center">No comments yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
