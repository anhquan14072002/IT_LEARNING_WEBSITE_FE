import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import restClient, { BASE_URL, BASE_URL_FE } from "../../services/restClient";
import PostContext from "../../store/PostContext";
import image from "../../assets/img/image.png";
import like from "../../assets/Icons/like.png";
import likeBlue from "../../assets/Icons/likeBlue.png";
import UncontrolledEditor from "../../shared/CustomEditorSecond";
import LoadingScreen from "../LoadingScreen";
import { InputText } from "primereact/inputtext";
import { ACCEPT, containsRudeWords, isLoggedIn } from "../../utils";

const validationSchema = Yup.object({
  content: Yup.string().required("Câu trả lời không được bỏ trống"),
});

const PostAnswer = ({ post }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewAnswer, setViewAnswer] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState({
    isChange: false,
    data: null,
  });
  const user = useSelector((state) => state.user.value);
  const {
    createPostComment,
    checkUser,
    refresh,
    createPostNotification,
    updatePostComment,
  } = useContext(PostContext);
  const { id, userId, fullName, numberOfComment } = post;
  // const [numberOfCommentFake, setNumberOfCommentFake] =
  //   useState(numberOfComment);
  const toast = useRef(null);
  const [visibleCount, setVisibleCount] = useState(3);

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => Math.min(prevCount + 3, answers.length));
  };
  const fetchPost = useCallback(async () => {
    // console.log(numberOfCommentFake);
    // setTimeout(async () => {
    if (numberOfComment > 0) {
      setLoading(true);
      setViewAnswer(true);
      try {
        const response = await restClient({
          url: `api/postcomment/getallcommentbypostidpagination?postId=${id}`,
          method: "GET",
        });
        setAnswers(response.data.data);
      } catch {
        setAnswers([]);
      } finally {
        setLoading(false);
      }
    }
    // }, 1000);
  }, [refresh, id, numberOfComment]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const onSubmitAnswer = async (content) => {
    if (checkUser()) {
      const postComment = { content, postId: post?.id, userId: user?.sub };

      setIsChangeInput({ isChange: false, data: null });
      // setNumberOfCommentFake((preValue) => preValue + 1);
      if (!isChangeInput?.data?.content) {
        await createPostComment(postComment, fetchPost);
      } else {
        await updatePostComment(
          { ...postComment, id: isChangeInput?.data?.id },
          fetchPost
        );
      }
      console.log(user?.sub != userId);

      if (user?.sub != userId) {
        notifyPersonalResponse();
      }
    }
  };

  function notifyPersonalResponse() {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 1,
      userSendId: user?.sub,
      userSendName: user?.name,
      userReceiveId: userId,
      userReceiveName: fullName,
      description: `${user?.name} đã phản hồi bài viết của bạn`,
      notificationTime: new Date(),
      isRead: false,
      link: `${BASE_URL_FE}/post/${id}`,
    };
    createPostNotification(body);
  }
  return (
    <>
      <Toast ref={toast} />
      <div className="flex flex-col gap-3 px-4 py-5 bg-[#f6f6f6]">
        {!isChangeInput?.isChange ? (
          <p className="flex gap-3 border-stone-200 border-b-2 pb-3">
            <span className="flex items-center">
              <img
                src={user?.picture || image}
                alt="Ảnh người dùng"
                style={{
                  borderRadius: "25px",
                  height: "30px",
                  maxWidth: "30px",
                }}
              />
            </span>
            <span>
              <InputText
                type="text"
                className="p-inputtext-lg border-2 p-1  border-stone-300 rounded w-[72vh]"
                placeholder="Trả lời nhanh câu hỏi này"
                onClick={() =>
                  checkUser() &&
                  setIsChangeInput({ isChange: true, data: null })
                }
              />
            </span>
          </p>
        ) : (
          <SendAnswer
            setIsChangeInput={setIsChangeInput}
            isChangeInput={isChangeInput}
            loading={loading}
            setLoading={setLoading}
            onSubmitAnswer={onSubmitAnswer}
            ref={toast}
          />
        )}
        {answers.slice(0, visibleCount).map((comment) => (
          <Answer
            key={comment.id}
            id={comment.id}
            avatar={comment.avatar || user?.picture}
            fullName={comment.fullName}
            userId={comment.userId}
            createdDate={comment.createdDate}
            content={comment.content}
            fetchPost={fetchPost}
            likeCount={comment.correctVote}
            post={post}
            checkUser={checkUser}
            isVoteComment={
              comment?.voteComments?.findIndex(
                (e) => e.userId === user?.sub
              ) !== -1
            }
            setIsChangeInput={setIsChangeInput}
            postCommentChilds={comment?.postCommentChilds}
          />
        ))}

        {visibleCount < answers.length && (
          <Button
            label="Xem thêm câu trả lời"
            text
            raised
            onClick={handleLoadMore}
            className="w-full bg-blue-600 text-white p-2 text-sm font-bold"
          />
        )}
      </div>
    </>
  );
};

const Answer = ({
  id,
  avatar,
  fullName,
  createdDate,
  content,
  likeCount,
  fetchPost,
  checkUser,
  userId,
  post,
  response,
  isVoteComment,
  postCommentChilds,
  setIsChangeInput,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  // const [isChangeInput, setIsChangeInput] = useState(false);
  const [isViewMore, setIsViewMore] = useState(false);
  const [isLike, setIsLike] = useState(isVoteComment);

  const toast = useRef(null);

  const user = useSelector((state) => state.user.value);
  const isCheckUser =
    (userId === user?.sub && isLoggedIn()) ||
    (user?.name === "admin" && isLoggedIn());
  console.log("isCheckUser");
  console.log(isCheckUser);

  const {
    createVoteComment,
    createResponseAnswer,
    deletePostComment,
    createPostNotification,
    fetchPostCommentById,
    // postCommentChilds,
  } = useContext(PostContext);

  const formattedDate = new Date(createdDate).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const voteComment = (isLike) => {
    if (checkUser()) {
      setIsLike((preValue) => !preValue);
      createVoteComment(id, isLike, fetchPost);
      if (user?.sub !== userId) {
        notifyPersonalResponse(" đã thích bài viết của bạn");
      }
    }
  };

  const deleteAnswer = () => {
    if (checkUser()) {
      deletePostComment(id, fetchPost);
      notifyAllResponse(" đã thu hồi phản hồi thành công", 1);
    }
  };
  const updateAnswer = () => {
    if (checkUser()) {
      setIsChangeInput({ isChange: true, data: { content: content, id: id } });
    }
  };
  const responseAnswer = () => {
    if (checkUser()) {
      // setIsViewMore(true);
      setIsChangeInput(true);
    }
  };

  const onSubmitAnswer = async (content) => {
    if (checkUser()) {
      const postComment = {
        content,
        postId: post?.id,
        userId: user?.sub,
        parentId: id,
      };
      setIsChangeInput(false);
      await createResponseAnswer(postComment, fetchPost);
      notifyPersonalResponse(" đã phản hồi bài viết của bạn");
    }
  };
  function notifyPersonalResponse(msg) {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 2,
      userSendId: user?.sub,
      userSendName: user?.name,
      userReceiveId: userId,
      userReceiveName: fullName,
      description: `${user?.name} ${msg}`,
      notificationTime: new Date(),
      isRead: false,
      link: `${BASE_URL_FE}/post/${id}`,
    };
    createPostNotification(body);
  }
  function notifyAllResponse(msg, deleteResponse = 0) {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 1,
      userSendId: user?.sub,
      userSendName: user?.name,
      userReceiveId: userId,
      userReceiveName: fullName,
      description: deleteResponse === 1 ? `${user?.name} ${msg}` : `${msg}`,
      notificationTime: new Date(),
      isRead: false,
      link: `${BASE_URL_FE}/post/${id}`,
    };
    createPostNotification(body);
  }
  return (
    <div {...props}>
      <div className="flex flex-col gap-4 border-stone-200 border-b-2 pb-4">
        <p>
          <span className="flex gap-4">
            <span className="flex items-center">
              <img
                src={avatar || image}
                alt="Ảnh người dùng"
                style={{
                  borderRadius: "25px",
                  height: "30px",
                  maxWidth: "30px",
                }}
              />
            </span>
            <span className="flex flex-col">
              <strong>{fullName}</strong>
              <span className="text-sm text-stone-400">{formattedDate}</span>
            </span>
          </span>
        </p>
        <div
          dangerouslySetInnerHTML={{ __html: content }}
          className="text-xl"
        />
        <p className="flex items-center gap-3">
          <span
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => voteComment(isLike)}
          >
            {isLike && isLoggedIn() ? (
              <img src={likeBlue} width="18" alt="Like" />
            ) : (
              <img src={like} width="16" alt="Like" />
            )}
            <span> Đúng ({likeCount}) </span>
          </span>

          {/* {response != false && (
            <span>
              <a onClick={responseAnswer} className="cursor-pointer">
                Phản hồi
              </a>
            </span>
          )} */}
          {console.log(userId === user?.sub && isLoggedIn())}

          {isCheckUser && (
            <span>
              <a className="cursor-pointer" onClick={deleteAnswer}>
                Thu hồi
              </a>
            </span>
          )}

          {userId === user?.sub && isLoggedIn() && (
            <span>
              <a className="cursor-pointer" onClick={updateAnswer}>
                Sửa phản hồi
              </a>
            </span>
          )}
          {/* {postCommentChilds?.length > 0 && (
            <span>
              <a
                className="cursor-pointer"
                onClick={() => {
                  setIsViewMore((preValue) => !preValue);
                  fetchPostCommentById(id);
                }}
              >
                {!isViewMore ? " Xem thêm phản hồi" : "Thu gọn phản hồi"}
              </a>
            </span>
          )} */}
        </p>
        {/* {isChangeInput && (
          <SendAnswer
            className="ml-8 "
            setIsChangeInput={setIsChangeInput}
            loading={loading}
            setLoading={setLoading}
            onSubmitAnswer={onSubmitAnswer}
            ref={toast}
          />
        )} */}

        {/* {isViewMore &&
          postCommentChilds?.length > 0 &&
          postCommentChilds.map((comment) => (
            <Answer
              key={comment.id}
              id={comment.id}
              avatar={comment.avatar || user?.picture}
              fullName={comment.fullName}
              userId={comment.userId}
              createdDate={comment.createdDate}
              content={comment.content}
              fetchPost={fetchPost}
              likeCount={comment.correctVote || 0}
              post={post}
              checkUser={checkUser}
              postCommentChilds={comment?.postCommentChilds}
              isVoteComment={
                comment?.voteComments?.findIndex(
                  (e) => e.userId === user?.sub
                ) !== -1
              }
              response={false}
              className="ml-9"
            />
          ))} */}
      </div>
    </div>
  );
};

const SendAnswer = forwardRef(function SendAnswer(
  {
    setIsChangeInput,
    isChangeInput,
    onSubmitAnswer,
    loading,
    setLoading,
    ...props
  },
  ref
) {
  const user = useSelector((state) => state.user.value);
  const [content, setContent] = useState("");

  const handleEditorChange = (htmlContent) => {
    setContent(htmlContent);
  };

  const onSubmit = () => {
    if (content.trim() === "") {
      ACCEPT(ref, "Bạn cần nhập nội dung câu trả lời ? ");
      return;
    }
    if (containsRudeWords(content.trim())) {
      ACCEPT(ref, "Câu hỏi của bạn chứa những từ không hợp lệ");
      return;
    }
    // if (isChangeInput?.data) {
    onSubmitAnswer(content);
    // }
  };
  return (
    <div {...props}>
      <Toast ref={ref} />
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <Formik initialValues={{}} validationSchema={validationSchema}>
          {() => (
            <Form className="flex flex-col">
              <div className="flex ">
                <span>
                  <img
                    src={user?.picture || image}
                    alt="Ảnh người dùng"
                    style={{
                      borderRadius: "25px",
                      height: "30px",
                      maxWidth: "30px",
                    }}
                  />
                </span>
                <div className="flex-grow ml-2">
                  <UncontrolledEditor
                    onChange={handleEditorChange}
                    value={isChangeInput?.data?.content ?? ""}
                  />
                  <ErrorMessage name="content" component="div" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-12">
                <Button
                  className="px-3 border-2 hover:bg-gray-100 "
                  type="button"
                  severity="danger"
                  onClick={() =>
                    setIsChangeInput({ isChange: false, data: null })
                  }
                >
                  Hủy
                </Button>
                <Button
                  className="p-2 bg-blue-600 hover:bg-blue-500 text-white font-bold"
                  type="submit"
                  onClick={onSubmit}
                >
                  {isChangeInput?.data?.content ? "Sửa" : "Tạo"} câu trả lời
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </div>
  );
});

export default PostAnswer;
