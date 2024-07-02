import React, { useEffect, useState } from "react";
import avatar from "../../assets/logo.png";
import { Avatar } from "primereact/avatar";
import { Rating } from "primereact/rating";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Editor } from "primereact/editor";
import { useSelector } from "react-redux";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";

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

export default function Comment({
  documentId,
  toast,
  listCommentByUser,
  fetDocumentByUser,
}) {
  const [comments, setComments] = useState(commentsData);
  const [newComment, setNewComment] = useState("");
  const [newRating, setNewRating] = useState(null);
  const user = useSelector((state) => state.user.value);
  const [commentList, setCommentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchComment();
  }, []);

  const fetchComment = () => {
    if (user && user.sub) {
      restClient({
        url:
          `api/commentdocument/getallcommentbydocumentidpagination?documentId=` +
          documentId,
        method: "GET",
      })
        .then((res) => {
          const filteredData = res.data.data.filter(
            (r) => r.userId !== user.sub
          );
          setCommentList(filteredData);
        })
        .catch((err) => {
          setCommentList([]);
        });
    } else {
      restClient({
        url:
          `api/commentdocument/getallcommentbydocumentidpagination?documentId=` +
          documentId,
        method: "GET",
      })
        .then((res) => {
          setCommentList(res.data.data);
        })
        .catch((err) => {
          setCommentList([]);
        });
    }
  };

  const comment = () => {
    console.log("comment::", newComment);
    console.log("rating::", newRating);
    if (!newComment || (typeof newComment === "string" && !newComment.trim())) {
      REJECT(toast, "Vui lòng không để trống ô bình luận");
    }
    if (!newRating) {
      REJECT(toast, "Vui lòng chọn điểm đánh giá");
    }
    if (
      newComment &&
      newRating &&
      typeof newComment === "string" &&
      newComment.trim()
    ) {
      const data = {
        note: newComment,
        rating: newRating,
        documentId,
        userId: user?.sub,
      };
      restClient({
        url: "api/commentdocument/createcommentdocument",
        method: "POST",
        data,
      })
        .then((res) => {
          setNewComment("");
          setNewRating(null);
          SUCCESS(toast, "Thêm đánh giá thành công");
          fetchComment();
          fetDocumentByUser();
        })
        .catch((err) => {
          REJECT(toast, "Xảy ra lỗi khi thêm đánh giá");
        });
    }
  };

  return (
    <div>
      <div className="py-20">
        <hr />
        <h1 className="font-bold text-center mt-5">Phần đánh giá</h1>
        {/* Comment Editor */}

        {listCommentByUser.length === 0 && (
          <div className="mt-2 border border-solid border-gray-300 p-4 rounded-xl">
            <h2 className="font-bold mb-4">
              Nhập đánh giá của bạn về bộ tài liệu này
            </h2>
            <Rating
              value={newRating}
              onChange={(e) => setNewRating(e.value)}
              stars={5}
              className="mb-4"
            />
            <textarea
              className="w-full h-20 border border-gray-400sadf"
              defaultValue={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button
              label="Gửi"
              icon="pi pi-send"
              className="bg-blue-600 p-2 text-white 
        "
              onClick={comment}
            />
          </div>
        )}

        {/* Comments Of User */}
        <div className="mt-10">
          <>
            {listCommentByUser &&
              listCommentByUser.map((comment, index) => (
                <>
                  <div className="my-5">
                    {" "}
                    <div className="flex gap-5 items-center" key={index}>
                      <div>
                        <img
                          src={"https://picsum.photos/200/300"}
                          className="border border-gray-300 rounded-full h-16 w-16"
                        />
                      </div>
                      <div className="border border-solid border-gray-300 p-4 rounded-xl flex-1">
                        <div className="flex gap-5">
                          <div>
                            <p className="font-bold">name</p>
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
                              {/* &nbsp;{new Date(comment.createdAt).toLocaleString()} */}
                              date
                            </p>
                          </div>
                        </div>
                        <div className="my-2">
                          <Rating
                            value={comment?.rating || 0}
                            readOnly
                            stars={5}
                            cancel={false}
                            className="shadow-none"
                          />
                        </div>
                        <div>
                          <p>{comment?.note}</p>
                        </div>
                      </div>
                      {/* Edit and Delete Buttons */}
                    </div>
                    <div className="flex justify-end gap-5">
                      <div>
                        <Button
                          label="Edit"
                          className="p-button-success p-button-outlined bg-green-500 text-white p-1"
                          icon="pi pi-pencil"
                          onClick={() => handleEdit(comment)}
                        />
                      </div>
                      <div>
                        <Button
                          label="Delete"
                          className="p-button-danger p-button-outlined bg-red-500 text-white p-1"
                          icon="pi pi-trash"
                          onClick={() => handleDelete(comment.id)}
                        />
                      </div>
                    </div>
                  </div>
                </>
              ))}
          </>
        </div>

        {/* Comments List */}
        <div className="mt-10">
          {loading ? (
            <Loading />
          ) : (
            <>
              {commentList &&
                commentList.map((comment, index) => (
                  <div className="flex gap-5 items-center mt-5" key={index}>
                    <div>
                      <img
                        src={"https://picsum.photos/200/300"}
                        className="border border-gray-300 rounded-full h-16 w-16"
                      />
                    </div>
                    <div className="border border-solid border-gray-300 p-4 rounded-xl flex-1">
                      <div className="flex gap-5">
                        <div>
                          <p className="font-bold">name</p>
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
                            {/* &nbsp;{new Date(comment.createdAt).toLocaleString()} */}
                            date
                          </p>
                        </div>
                      </div>
                      <div className="my-2">
                        <Rating
                          value={comment?.rating || 0}
                          readOnly
                          stars={5}
                          cancel={false}
                          className="shadow-none"
                        />
                      </div>
                      <div>
                        <p>{comment?.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
