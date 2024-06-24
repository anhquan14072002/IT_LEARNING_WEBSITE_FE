import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import Loading from "../Loading";
import "./index.css";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import restClient from "../../services/restClient";
import CustomDropdown from "../../shared/CustomDropdown";

export default function AddLessonDialog({
  visible,
  setVisible,
  toast,
  getData,
}) {
  const [files, setFiles] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [isLoadingAddLesson, setIsLoadingAddLesson] = useState(false);

  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề không được bỏ trống"),
    content: Yup.string().required("Mô tả không được bỏ trống"),
    topic: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0; // Check if object is not empty
      })
      .required("Không bỏ trống trường này"),
  });

  const initialValues = {
    title: "",
    topic: {},
    content: "",
  };

  const onSubmit = (values) => {
    console.log("====================================");
    console.log("files:" + files);
    console.log("====================================");
    if (files.length === 0) {
      REJECT(toast, "Vui lòng chọn file để tải lên");
      return;
    }
    if (files.some((file) => file.size > 10485760)) {
      REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 10mb");
      return;
    }
    setIsLoadingAddLesson(true);

    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("TopicId", values.topic.id);
    formData.append("Content", values.content);
    formData.append("IsActive", true);

    files.forEach((file) => {
      formData.append("FilePath", file);
    });

    restClient({
      url: "api/lesson/createlesson",
      method: "POST",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        SUCCESS(toast, "Thêm bài học thành công");
        getData();
        setIsLoadingAddLesson(false);
        setFiles([]);
      })
      .catch((err) => {
        REJECT(toast, "Cập nhật không thành công");
        setIsLoadingAddLesson(false);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  useEffect(() => {
    restClient({ url: "api/topic/getalltopic", method: "GET" })
      .then((res) => {
        setListTopic(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        setListTopic([]);
      });
  }, []);

  return (
    <Dialog
      header="Thêm bài học"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        setFiles([]);
        if (!visible) return;
        setVisible(false);
      }}
    >
      {isLoadingAddLesson ? (
        <Loading />
      ) : (
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

              <CustomDropdown
                title="Chọn chủ đề"
                label="Chủ đề"
                name="topic"
                id="topic"
                options={topicList}
              />

              <div>
                <label htmlFor="content">Nội dung bài học</label>

                <CustomEditor name="content" id="content">
                  <ErrorMessage name="content" component="div" />
                </CustomEditor>
              </div>

              <div>
                <label htmlFor="content">Tải file lên</label>
                <FileUpload
                  id="content"
                  name="demo[]"
                  url={"/api/upload"}
                  accept=".docx, application/vnd.openxmlformats-officedocument.wordprocessingml.document, .pdf, application/pdf"
                  maxFileSize={10485760} // 10MB
                  emptyTemplate={
                    <p className="m-0">Drag and drop files here to upload.</p>
                  }
                  className="custom-file-upload mb-2"
                  onSelect={onFileSelect}
                />
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => {
                    setVisible(false);
                  }}
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
      )}
    </Dialog>
  );
}
