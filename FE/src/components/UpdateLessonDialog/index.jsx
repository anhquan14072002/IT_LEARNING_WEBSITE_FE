import React, { useEffect, useState } from "react";
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
import restClient from "../../services/restClient";
import Loading from "../Loading";

export default function UpdateLessonDialog({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  getData,
  modelUpdate,
}) {
  const [files, setFiles] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [isLoadingAddUpdate, setIsLoadingAddUpdate] = useState(false);

  const initialValues = {
    title: modelUpdate.title,
    topicId: modelUpdate.topicId,
    content: modelUpdate.content,
  };

  const validationSchema = Yup.object({
    title: Yup.string().required("Tiêu đề không được bỏ trống"),
    content: Yup.string().required("Mô tả không được bỏ trống"),
    topicId: Yup.string().required("Chủ đề không được bỏ trống"),
  });

  const onSubmit = (values) => {
    if (files.some((file) => file.size > 52428800)) {
      REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 50mb");
      return;
    }
    setIsLoadingAddUpdate(true);

    const formData = new FormData();
    formData.append("Id", modelUpdate.id);
    formData.append("Title", values.title);
    formData.append("TopicId", values.topicId);
    formData.append("Content", values.content);
    formData.append("IsActive", true);

    if (files) {
      files.forEach((file) => {
        formData.append("FilePath", file);
      });
    }

    restClient({
      url: "api/lesson/updatelesson",
      method: "PUT",
      data: formData,
      headers: { "Content-Type": "multipart/form-data" },
    })
      .then((res) => {
        SUCCESS(toast, "Cập nhật bài học thành công");
        getData();
        setIsLoadingAddUpdate(false);
      })
      .catch((err) => {
        REJECT(toast,"Cập nhật không thành công");
        setIsLoadingAddUpdate(false);
      })
      .finally(() => {
        setVisibleUpdate(false);
      });
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  useEffect(() => {
    restClient({ url: "api/topic/getalltopic", method: "PUT" })
      .then((res) => {
        setListTopic(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        setListTopic([]);
      });
  }, []);

  return (
    <Dialog
      header="Cập nhật bài học"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        setFiles([])
        if (!visibleUpdate) return;
        setVisibleUpdate(false);
      }}
    >
      {isLoadingAddUpdate ? (
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
                  onClick={() => setVisibleUpdate(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Cập nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
