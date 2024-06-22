import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import "./index.css";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import { FileUpload } from "primereact/fileupload";

export default function AddLessonDialog({ visible, setVisible, toast }) {
  const [isUpload, setIsUpload] = useState(false);
  const [files, setFiles] = useState([]);

  const initialValues = {
    title: "",
    class: "",
    topic: "",
    description: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề không được bỏ trống"),
    class: Yup.string().required("Lớp không được bỏ trống"),
    description: isUpload === false ? Yup.string().required("Mô tả không được bỏ trống") : Yup.string(),
    topic: Yup.string().required("Chủ đề không được bỏ trống"),
  });

  const onSubmit = (values) => {
    if (isUpload && files.length === 0) {
      REJECT(toast,"Vui lòng chọn file để tải lên")
      return;
    }
    if (isUpload && files.some(file => file.size > 2097152)) {
      REJECT(toast,"Vui lòng chọn file nhỏ hơn hoặc bằng 2mb")
      return;
    }
    console.log("Form data", {...values,files});
    SUCCESS(toast,"Thêm thành công");
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  return (
    <Dialog
      header="Thêm bài học"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {(formik) => (
          <Form>
            <CustomTextInput
              label="Tiêu đề"
              name="title"
              type="text"
              id="title"
            />

            <CustomSelectInput
              label="Lớp"
              name="class"
              id="class"
              flexStyle="flex-1"
            >
              <option value="">Select a class</option>
              <option value="Class 1">Class 1</option>
              <option value="Class 2">Class 2</option>
              <option value="Class 3">Class 3</option>
              <ErrorMessage name="class" component="div" />
            </CustomSelectInput>

            <CustomSelectInput
              label="Chủ đề"
              name="topic"
              id="topic"
              flexStyle="flex-1"
            >
              <option value="">Select a topic</option>
              <option value="topic 1">topic 1</option>
              <option value="topic 2">topic 2</option>
              <option value="topic 3">topic 3</option>
              <ErrorMessage name="topic" component="div" />
            </CustomSelectInput>

            <div>
              <label htmlFor="description">Nội dung bài học</label>
              <div className="flex justify-center">
                <h1
                  className={classNames(
                    "p-2 hover:bg-blue-500 hover:text-white cursor-pointer",
                    {
                      "bg-blue-500 text-white": isUpload === false,
                    }
                  )}
                  onClick={() => setIsUpload(!isUpload)}
                >
                  Soạn bài
                </h1>
                <h1
                  className={classNames(
                    "p-2 hover:bg-blue-500 hover:text-white cursor-pointer",
                    {
                      "bg-blue-500 text-white": isUpload === true,
                    }
                  )}
                  onClick={() => setIsUpload(!isUpload)}
                >
                  Tải file lên
                </h1>
              </div>
              {isUpload === false && (
                <CustomEditor name="description" id="description">
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              )}
              {isUpload === true && (
                <FileUpload
                  name="demo[]"
                  url={"/api/upload"}
                  accept="*"
                  maxFileSize={2097152} // 2MB
                  emptyTemplate={
                    <p className="m-0">Drag and drop files here to upload.</p>
                  }
                  className="custom-file-upload mb-2"
                  onSelect={onFileSelect}
                />
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                className="p-2 bg-red-500 text-white"
                type="button"
                severity="danger"
                onClick={() => setVisible(false)}
              >
                Hủy
              </Button>
              <Button className="p-2 bg-blue-500 text-white" type="submit">
                Thêm
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
