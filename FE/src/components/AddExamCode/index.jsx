import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import { Button } from "primereact/button";
import Loading from "../Loading";
import { REJECT, SUCCESS } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import restClient from "../../services/restClient";

const validationSchema = Yup.object({
  code: Yup.string().required("Không được bỏ trống"),
  files: Yup.array().min(1, "Bắt buộc phải có file"),
});

export default function AddExamCode({
  visible,
  setVisibleAddExamCode,
  addExamCodeValue,
  fetchData,
  toast,
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const initialValues = {
    code: "",
    files: [],
  };

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("Code", values.code);
    formData.append("ExamId", addExamCodeValue);
    formData.append("ExamFileUpload", files[0]);

    try {
      await restClient({
        url: "api/examcode/createexamcode",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      SUCCESS(toast, "Thêm đề thi thành công");
      resetForm();
      fetchData();
    } catch (error) {
      console.error("Error adding exam:", error);
      REJECT(toast, error.message);
    } finally {
      setLoading(false);
      setVisibleAddExamCode(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  return (
    <Dialog
      header="Thêm Đề Thi"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => setVisibleAddExamCode(false)}
    >
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
            <Form>
              <CustomTextInput
                label={
                  <>
                    <span>Code</span>
                    
                  </>
                }
                id="code"
                name="code"
                type="text"
              />

              <h1>File Đề Bài <span style={{color:"red"}}>*</span> </h1>
              <Field name="files">
                {({ field }) => (
                  <FileUpload
                    name="ExamFileUpload"
                    accept=".pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Kéo và thả file vào đây để tải lên.</p>
                    }
                    onSelect={(e) => {
                      setFieldValue("files", e.files);
                      onFileSelect(e);
                    }}
                    onClear={() => {
                      setFieldValue("files", []);
                      setFiles([]);
                    }}
                  />
                )}
              </Field>
              {errors.files && touched.files && (
                <div className="p-error">{errors.files}</div>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  onClick={() => setVisibleAddExamCode(false)}
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
