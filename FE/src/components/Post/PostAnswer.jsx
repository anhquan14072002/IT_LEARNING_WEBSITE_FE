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
import restClient from "../../services/restClient";
import PostContext from "../../store/PostContext";
import image from "../../assets/img/image.png";
import like from "../../assets/Icons/like.png";
import UncontrolledEditor from "../../shared/CustomEditorSecond";
import LoadingScreen from "../LoadingScreen";
import { InputText } from "primereact/inputtext";
import { ACCEPT } from "../../utils";

const validationSchema = Yup.object({
  content: Yup.string().required("Câu trả lời không được bỏ trống"),
});

const PostAnswer = ({ post }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewAnswer, setViewAnswer] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const user = useSelector((state) => state.user.value);
  const { createPostComment, checkUser, refresh, createPostNotification } =
    useContext(PostContext);
  const { id, userId, fullName } = post;
  const toast = useRef(null);

  const fetchPost = useCallback(async () => {
    setLoading(true);
    setViewAnswer(true);
    try {
      const response = await restClient({
        url: `api/postcomment/getallcommentbypostid?postId=${id}`,
        method: "GET",
      });
      setAnswers(response.data.data);
    } catch {
      setAnswers([]);
    } finally {
      setLoading(false);
    }
  }, [refresh]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost, refresh]);

  const onSubmitAnswer = async (content) => {
    if (checkUser()) {
      const postComment = { content, postId: post?.id, userId: user?.sub };
      setIsChangeInput(false);
      await createPostComment(postComment, fetchPost);
      notifyPersonalResponse();
    }
  };

  function notifyPersonalResponse() {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 2,
      userSendId: user?.sub,
      userSendName: user?.name,
      userReceiveId: userId,
      userReceiveName: fullName,
      description: `${user?.name} đã phản hồi bài viết của bạn`,
      notificationTime: new Date(),
      isRead: true,
      link: "string",
    };
    createPostNotification(body);
  }
  return (
    <>
      <Toast ref={toast} />
      <div className="flex flex-col gap-3 px-4 py-5 bg-[#f6f6f6]">
        {!isChangeInput ? (
          <p className="flex gap-3 border-stone-200 border-b-2 pb-3">
            <span className="flex items-center">
              <img
                src={user?.picture || image}
                alt="Ảnh người dùng"
                width="30px"
                style={{ borderRadius: "25px" }}
              />
            </span>
            <InputText
              type="text"
              className="p-inputtext-lg border-2 p-1 border-stone-300 rounded w-[72vh]"
              placeholder="Trả lời nhanh câu hỏi này"
              onClick={() => checkUser() && setIsChangeInput(true)}
            />
          </p>
        ) : (
          <SendAnswer
            setIsChangeInput={setIsChangeInput}
            loading={loading}
            setLoading={setLoading}
            onSubmitAnswer={onSubmitAnswer}
            ref={toast}
          />
        )}
        {answers.map((comment) => (
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
          />
        ))}
        {answers.length > 0 && (
          <Button
            label="Xem thêm câu trả lời"
            text
            raised
            className="w-full bg-blue-600 text-white p-2 text-sm font-normal"
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
  postCommentChilds,
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const [isViewMore, setIsViewMore] = useState(false);
  const toast = useRef(null);
  const user = useSelector((state) => state.user.value);
  const {
    createVoteComment,
    createResponseAnswer,
    deletePostComment,
    createPostNotification,
  } = useContext(PostContext);

  const formattedDate = new Date(createdDate).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const voteComment = () => {
    createVoteComment(id, fetchPost);
    notifyPersonal();
  };

  const deleteAnswer = () => {
    if (checkUser()) {
      deletePostComment(id, fetchPost);
    }
  };
  const responseAnswer = () => {
    if (checkUser()) {
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
      notifyPersonalResponse();
    }
  };
  function notifyPersonalResponse() {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 2,
      userSendId: user?.sub,
      userSendName: user?.name,
      userReceiveId: userId,
      userReceiveName: fullName,
      description: `${user?.name} đã phản hồi bài viết của bạn`,
      notificationTime: new Date(),
      isRead: true,
      link: "string",
    };
    createPostNotification(body);
  }
  function notifyPersonal() {
    /* solution: Where is the origin of action from ? 
          - pass body in request :  */
    const body = {
      notificationType: 2,
      userSendId: user?.sub,
      userSendName: user?.name,
      userReceiveId: userId,
      userReceiveName: fullName,
      description: `${user?.name} đã thích bài viết của bạn`,
      notificationTime: new Date(),
      isRead: true,
      link: "string",
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
                width="30px"
                style={{ borderRadius: "25px" }}
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
            onClick={voteComment}
          >
            <img src={like} width="16" alt="Like" />
            <span> Đúng ({likeCount}) </span>
          </span>

          {response != false && (
            <span>
              <a onClick={responseAnswer} className="cursor-pointer">
                Phản hồi
              </a>
            </span>
          )}

          {userId === user?.sub && (
            <span>
              <a className="cursor-pointer" onClick={deleteAnswer}>
                Thu hồi
              </a>
            </span>
          )}
          {postCommentChilds?.length > 0 && (
            <span>
              <a
                className="cursor-pointer"
                onClick={() => setIsViewMore((preValue) => !preValue)}
              >
                {!isViewMore ? " Xem thêm phản hồi" : "Thu gọn phản hồi"}
              </a>
            </span>
          )}
        </p>
        {isChangeInput && (
          <SendAnswer
            className="ml-8 "
            setIsChangeInput={setIsChangeInput}
            loading={loading}
            setLoading={setLoading}
            onSubmitAnswer={onSubmitAnswer}
            ref={toast}
          />
        )}

        {isViewMore &&
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
              response={false}
              className="ml-9"
            />
          ))}
      </div>
    </div>
  );
};

const SendAnswer = forwardRef(function SendAnswer(
  { setIsChangeInput, onSubmitAnswer, loading, setLoading, ...props },
  ref
) {
  const user = useSelector((state) => state.user.value);
  const [content, setContent] = useState("");

  const handleEditorChange = (htmlContent) => {
    setContent(htmlContent);
  };

  const onSubmit = () => {
    if (content.trim() === "") {
      console.log(1234);
      ACCEPT(ref, "Bạn cần nhập nội dung câu trả lời ? ");
      return;
    }
    onSubmitAnswer(content);
  };

  return (
    <div {...props}>
      <Toast ref={ref} />
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <Formik initialValues={{}} validationSchema={validationSchema}>
          {() => (
            <Form>
              <div className="flex">
                <span>
                  <img
                    src={user?.picture || image}
                    alt="Ảnh người dùng"
                    width="30px"
                    style={{ borderRadius: "25px" }}
                  />
                </span>
                <div className="flex-grow ml-2">
                  <UncontrolledEditor onChange={handleEditorChange} />
                  <ErrorMessage name="content" component="div" />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-12">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  onClick={() => setIsChangeInput(false)}
                >
                  Hủy
                </Button>
                <Button
                  className="p-2 bg-blue-500 text-white"
                  onClick={onSubmit}
                >
                  Gửi câu trả lời
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
