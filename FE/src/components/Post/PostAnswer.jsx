import React, {
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import image from "../../assets/img/image.png";
import { InputText } from "primereact/inputtext";
import * as Yup from "yup";
import like from "../../assets/Icons/like.png";
import { Button } from "primereact/button";
import restClient from "../../services/restClient";
import { useSelector } from "react-redux";
import { Toast } from "primereact/toast";
import PostContext from "../../store/PostContext";
import { Formik, Form, ErrorMessage, Field } from "formik";
import CustomEditor from "../../shared/CustomEditor";
import LoadingScreen from "../LoadingScreen";

function PostAnswer({ post }) {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isViewAswer, setViewAnswer] = useState(false);
  const [isChangeInput, setIsChangeInput] = useState(false);
  const user = useSelector((state) => state.user.value);
  const { createPostComment } = useContext(PostContext);
  const { id } = post;
  const toast = useRef(null);
  const fetchPost = useCallback(() => {
    setLoading(true);
    setViewAnswer(true);
    restClient({
      url: `api/postcomment/getallcommentbypostid?postId=${id}`,
      method: "GET",
    })
      .then((res) => {
        setAnswers(res.data.data);
      })
      .catch((err) => {
        setAnswers([]);
      })
      .finally(() => setLoading(false));
  }, [id]);
  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const onSubmitAnswer = async (values) => {
    if (!user?.sub) {
      ACCEPT(toast, "Bạn chưa đăng nhập ?");
      return;
    }
    let postComment = {
      content: values?.content,
      postId: post?.id,
      userId: user?.sub,
    };
    setIsChangeInput(false);
    await createPostComment(postComment, fetchPost);
  };
  let Input = !isChangeInput ? (
    <p className="flex gap-3 border-stone-200 border-b-2 pb-3">
      <span className="flex items-center">
        <img
          src={user.picture || image}
          alt="Ảnh người dùng"
          width="30px"
          style={{ borderRadius: "25px" }}
        />
      </span>
      <InputText
        type="text"
        className="p-inputtext-lg border-2 p-1 border-stone-300 rounded w-[72vh]"
        placeholder="Trả lời nhanh câu hỏi này"
        onClick={() => setIsChangeInput((preValue) => !preValue)}
      />
    </p>
  ) : (
    <SendAnswer
      setIsChangeInput={setIsChangeInput}
      loading={loading}
      setLoading={setLoading}
      onSubmitAnswer={onSubmitAnswer}
      user={user}
      ref={toast}
    />
  );

  return (
    <div className="flex flex-col gap-3 px-4 py-5 bg-[#f6f6f6] ">
      {Input}
      {answers.map((comment) => {
        return (
          <Answer
            key={comment.id}
            id={comment.id}
            avatar={comment.avatar}
            fullName={comment.fullName}
            createdDate={comment.createdDate}
            content={comment.content}
            fetchPost={fetchPost}
            likeCount={comment.correctVote || 0} // Assuming correctVote indicates likes
            post={post}
          />
        );
      })}
      <p>
        {answers.length > 0 && (
          <Button
            label="Xem thêm câu trả lời"
            text
            raised
            className="w-full bg-blue-600 text-white p-2 text-sm font-normal"
          />
        )}
      </p>
    </div>
  );
}

export default PostAnswer;

const Answer = ({
  id,
  avatar,
  fullName,
  createdDate,
  content,
  likeCount,
  fetchPost,
  post,
}) => {
  const { createVoteComment } = useContext(PostContext);
  const [isChangeInput, setIsChangeInput] = useState(false);
  // Format the created date
  const formattedDate = new Date(createdDate).toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  function voteComment() {
    createVoteComment(id, fetchPost);
  }
  return (
    <div className="flex flex-col gap-4 border-stone-200 border-b-2 pb-4">
      <p>
        <span className="flex gap-4">
          <span className="flex items-center">
            <img
              src={avatar || image} // Provide a default avatar if null
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
      <p className="text-xl">{content}</p>
      <p className="flex items-center gap-3">
        <span
          className="flex  items-center gap-2 cursor-pointer"
          onClick={voteComment}
        >
          <span>
            <img src={like} width="16" alt="Like" />
          </span>
          <span> Đúng ({likeCount}) </span>
        </span>
        <span>
          <a href="#" onClick={() => setIsChangeInput(true)}>
            Phản hồi
          </a>
        </span>
      </p>
      <p>
        {" "}
        {isChangeInput && (
          // có parent id của cái mk comment
          <SendAnswer setIsChangeInput={setIsChangeInput} className="ml-14" />
        )}{" "}
      </p>
    </div>
  );
};

const validationSchema = Yup.object({
  content: Yup.string().required("Câu trả lời không được bỏ trống"),
});
const SendAnswer = forwardRef(function SendAnswer(
  { setIsChangeInput, onSubmitAnswer, loading, setLoading, user, ...props },
  ref
) {
  console.log(user);
  const initialValues = {
    content: "",
  };
  const onSubmit = (values) => {
    onSubmitAnswer(values);
  };
  return (
    <div {...props}>
      <Toast ref={ref} />
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form>
              <div className="flex gap-2 justify-between">
                <span>
                  <img
                    src={image} // Provide a default avatar if null
                    alt="Ảnh người dùng"
                    width="30px"
                    style={{ borderRadius: "25px" }}
                  />
                </span>
                <CustomEditor name="content" id="content">
                  <ErrorMessage name="content" component="div" />
                </CustomEditor>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setIsChangeInput(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
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
