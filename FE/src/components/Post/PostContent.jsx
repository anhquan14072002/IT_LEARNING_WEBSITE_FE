import React, { useContext, useRef, useState } from "react";
import PostContentItem from "./PostContentItem";
import * as Yup from "yup";
import "../../shared/CustomDropdown/index.css";
import PostContext from "../../store/PostContext";
import { Formik, Form, ErrorMessage, Field } from "formik";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { Toast } from "primereact/toast";
import { ACCEPT, containsRudeWords, SUCCESS } from "../../utils";
import { useSelector } from "react-redux";
import LoadingScreen from "../LoadingScreen";
function PostContent(props) {
  const [isCompose, setIsCompose] = useState(false);
  return (
    <div className="w-[80%] mt-4  h-screen flex flex-col gap-5 flex-grow ml-[18%]">
      {!isCompose ? (
        <ComposeComment onClick={(e) => setIsCompose(true)} />
      ) : (
        <PostWrite setIsCompose={setIsCompose} />
      )}
      <main>
        <PostContentItem />
      </main>
    </div>
  );
}

export default PostContent;
const validationSchema = Yup.object({
  description: Yup.string().required("Mô tả không được bỏ trống"),
  // grade: Yup.object()
  //   .test("is-not-empty", "Không được để trống trường này", (value) => {
  //     return value && Object.keys(value).length !== 0; // Check if object is not empty
  //   })
  //   .required("Không bỏ trống trường này"),
});

function PostWrite({ setIsCompose }) {
  const {
    classList: gradeList,
    createPost,
    loading,
    setLoading,
  } = useContext(PostContext);
  const user = useSelector((state) => state.user.value);
  const toast = useRef(null);

  const initialValues = {
    grade: {},
    description: "",
  };

  const onSubmit = (values) => {
    console.log(values.description);
    const { grade, description } = values;
    if (containsRudeWords(description)) {
      ACCEPT(toast, "Câu hỏi của bạn chứa những từ không hợp lệ ");
      return;
    }
    if (!user?.sub) {
      ACCEPT(toast, "Bạn chưa đăng nhập ?");
      return;
    }

    const descriptionPost = {
      description: description,
      userId: user?.sub,
      gradeId: grade?.id,
    };
    createPost(descriptionPost);
    setIsCompose((prevValue) => !prevValue);
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
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
            <Form>
              <CustomDropdownInSearch
                title="lớp"
                label="Chọn Lớp"
                name="grade"
                id="grade"
                isClear={true}
                handleOnChange={handleOnChangeGrade}
                options={gradeList}
              />
              <div>
                <CustomEditor
                  label="Soạn câu hỏi"
                  name="description"
                  id="description"
                >
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setIsCompose(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Tạo câu hỏi
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
  return (
    <header
      className="border-stone-200 border-2 p-3 rounded cursor-pointer"
      {...props}
    >
      <p className="flex gap-3">
        {" "}
        <i className="pi pi-user" style={{ color: "slateblue" }}></i>
        <span className="font-bold">Khách</span>
      </p>
      <p className="text-stone-500">Hãy nhập câu hỏi của bạn vào đây</p>
    </header>
  );
}
