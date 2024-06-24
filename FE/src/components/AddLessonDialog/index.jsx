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

export default function AddLessonDialog({
  visible,
  setVisible,
  toast,
  getData,
}) {
  const [files, setFiles] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [isLoadingAddLesson, setIsLoadingAddLesson] = useState(false);

  const initialValues = {
    title: "",
    topicId: "",
    content: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề không được bỏ trống"),
    content: Yup.string().required("Mô tả không được bỏ trống"),
    topicId: Yup.string().required("Chủ đề không được bỏ trống"),
  });

  const onSubmit = (values) => {
    console.log("====================================");
    console.log("files:" + files);
    console.log("====================================");
    if (files.length === 0) {
      REJECT(toast, "Vui lòng chọn file để tải lên");
      return;
    }
    if (files.some((file) => file.size > 52428800)) {
      REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 50mb");
      return;
    }
    setIsLoadingAddLesson(true);

    const formData = new FormData();
    formData.append("Title", values.title);
    formData.append("TopicId", values.topicId);
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

              <CustomSelectInput
                label="Chủ đề"
                name="topicId"
                id="topicId"
                flexStyle="flex-1"
              >
                <option value="">Select a topic</option>
                {topicList &&
                  topicList.map((topic) => (
                    <option key={topic.id} value={topic.id}>
                      {topic.title}
                    </option>
                  ))}
                <ErrorMessage name="topicId" component="div" />
              </CustomSelectInput>

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
                  maxFileSize={52428800} // 50MB
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
