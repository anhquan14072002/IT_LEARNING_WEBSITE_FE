import React, { useContext, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import PostContentItem from "./PostContentItem";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import LoadingScreen from "../LoadingScreen";
import UncontrolledEditor from "../../shared/CustomEditorSecond";
import PostContext from "../../store/PostContext";
import { ACCEPT, containsRudeWords } from "../../utils";
import "../../shared/CustomDropdown/index.css";
import { getAllGrade } from "../../services/grade.api";

const validationSchema = Yup.object({
  grade: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
});

function PostContent() {
  const [isCompose, setIsCompose] = useState(false);

  return (
    <div
      className="w-[80%] mt-4 h-screen flex flex-col gap-5 flex-grow "
      // className="w-[80%] mt-4 h-screen flex flex-col gap-5 flex-grow ml-[18%]"
    >
      {!isCompose ? (
        <ComposeComment onClick={() => setIsCompose(true)} />
      ) : (
        <PostWrite setIsCompose={setIsCompose} />
      )}
      <main>
        <PostContentItem />
      </main>
    </div>
  );
}

function PostWrite({ setIsCompose }) {
  const { createPost, loading, setLoading } = useContext(PostContext);
  const user = useSelector((state) => state.user.value);
  const toast = useRef(null);
  const [initialValues] = useState({ grade: {} });
  const [description, setDescription] = useState("");
  const [gradeList, setListGrade] = useState([]);
  useEffect(() => {
    getAllGrade(setLoading, setListGrade);
  }, []);
  const handleEditorChange = (htmlContent) => {
    setDescription(htmlContent);
  };

  const onSubmit = (values) => {
    if (description.trim() === "") {
      ACCEPT(toast, "Bạn cần nhập nội dung bài post ? ");
      return;
    }
    if (containsRudeWords(description)) {
      ACCEPT(toast, "Câu hỏi của bạn chứa những từ không hợp lệ");
      return;
    }
    if (!user?.sub) {
      ACCEPT(toast, "Bạn chưa đăng nhập?");
      return;
    }

    const descriptionPost = {
      content: description,
      userId: user?.sub,
      gradeId: values.grade?.id,
    };
    createPost(descriptionPost);
    setIsCompose(false);
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    helpers.setValue(e.value);
    setTouchedState(true);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <>
      <Toast ref={toast} />
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {(formik) => (
            <Form className="flex flex-col">
              <div className="w-40">
                <CustomDropdownInSearch
                  isNotRequired
                  title="Chọn Lớp"
                  name="grade"
                  id="grade"
                  isClear={true}
                  handleOnChange={(e, helpers, setTouchedState, props) =>
                    handleOnChangeGrade(e, helpers, setTouchedState, props)
                  }
                  options={gradeList}
                />
              </div>
              <div>
                <UncontrolledEditor onChange={handleEditorChange} />
                <ErrorMessage name="description" component="div" />
              </div>
              <div className="flex justify-end gap-2 mt-[3rem]">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setIsCompose(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Tạo bài đăng
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
}

function ComposeComment({ ...props }) {
  const user = useSelector((state) => state.user.value);
  return (
    <header
      className="border-stone-200 border-2 p-3 rounded cursor-pointer"
      {...props}
    >
      <p className="flex gap-3 items-center">
        {user?.picture ? (
          <span className="flex items-center">
            <img
              src={user?.picture}
              alt="Ảnh người dùng"
              width="30px"
              style={{ borderRadius: "25px" }}
            />
          </span>
        ) : (
          <i className="pi pi-user" style={{ color: "slateblue" }}></i>
        )}

        <span className="font-bold">{user?.name ?? "Khách"}</span>
      </p>
      <p className="text-stone-500">Hãy nhập câu hỏi của bạn vào đây</p>
    </header>
  );
}

export default PostContent;
