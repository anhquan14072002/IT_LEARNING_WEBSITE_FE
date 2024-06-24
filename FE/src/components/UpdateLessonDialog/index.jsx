import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { REJECT, SUCCESS } from "../../utils";
import "./index.css";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  content: Yup.string().required("Mô tả không được bỏ trống"),
  topic: Yup.object()
    .test("is-not-empty", "Chủ đề không được bỏ trống", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Chủ đề không được bỏ trống"),
});

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
  const [initialValuesReady, setInitialValuesReady] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title: "",
    topic: {},
    content: "",
  });

  useEffect(() => {
    const fetchTopics = async () => {
      try {
        const res = await restClient({ url: "api/topic/getalltopic", method: "GET" });
        if (Array.isArray(res.data.data)) {
          setListTopic(res.data.data);
          const selectedTopic = res.data.data.find(
            (item) => Number(item.id) === Number(modelUpdate.topicId)
          );
          setInitialValues({
            title: modelUpdate.title,
            content: modelUpdate.content,
            topic: selectedTopic || {},
          });
          setInitialValuesReady(true); // Data has been fetched and initial values are set
        }
      } catch (err) {
        setListTopic([]);
      }
    };

    if (visibleUpdate) {
      fetchTopics();
    }
  }, [visibleUpdate, modelUpdate]);

  const onSubmit = async (values, { setSubmitting }) => {
    if (files.some((file) => file.size > 10485760)) {
      REJECT(toast, "Vui lòng chọn file nhỏ hơn hoặc bằng 10mb");
      return;
    }
    setIsLoadingAddUpdate(true);

    const formData = new FormData();
    formData.append("Id", modelUpdate.id);
    formData.append("Title", values.title);
    formData.append("TopicId", values.topic.id); // Use topic.id for TopicId
    formData.append("Content", values.content);
    formData.append("IsActive", true);

    if (files) {
      files.forEach((file) => {
        formData.append("FilePath", file);
      });
    }

    try {
      await restClient({
        url: "api/lesson/updatelesson",
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      SUCCESS(toast, "Cập nhật bài học thành công");
      getData();
    } catch (err) {
      REJECT(toast, "Cập nhật không thành công");
    } finally {
      setIsLoadingAddUpdate(false);
      setVisibleUpdate(false);
      setSubmitting(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  return (
    <Dialog
      header="Cập nhật bài học"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        setFiles([]);
        setVisibleUpdate(false);
        setInitialValuesReady(false); // Reset the readiness state when the dialog is closed
      }}
    >
      {isLoadingAddUpdate ? (
        <Loading />
      ) : (
        initialValuesReady && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
          >
            {({ isSubmitting }) => (
              <Form>
                <CustomTextInput
                  label="Tiêu đề"
                  name="title"
                  type="text"
                  id="title"
                />

                <CustomDropdown
                  label="Chủ đề"
                  title="Chọn chủ đề"
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
                  <label htmlFor="fileUpload">Tải file lên</label>
                  <FileUpload
                    id="fileUpload"
                    name="files"
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
                    onClick={() => setVisibleUpdate(false)}
                  >
                    Hủy
                  </Button>
                  <Button className="p-2 bg-blue-500 text-white" type="submit" disabled={isSubmitting}>
                    Cập nhật
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        )
      )}
    </Dialog>
  );
}
