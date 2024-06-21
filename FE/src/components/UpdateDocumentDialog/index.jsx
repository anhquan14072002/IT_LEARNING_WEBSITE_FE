import React from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { ACCEPT, SUCCESS } from "../../utils";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  class: Yup.string().required("Lớp không được bỏ trống"),
  level: Yup.string().required("Cấp học không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
});

export default function UpdateDocumentDialog({ visibleUpdate, setVisibleUpdate, toast }) {
  const initialValues = {
    title: "",
    class: "",
    level: "",
    description: "fff",
  };

  const onSubmit = (values) => {
    console.log("Form data", values);
    SUCCESS(toast)
  };

  return (
    <Dialog
      header="Cập nhật tài liệu"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visibleUpdate) return;
        setVisibleUpdate(false);
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

            <div className="flex justify-center gap-2">
              <CustomSelectInput
                label="Cấp học"
                name="level"
                id="level"
                flexStyle="flex-1"
              >
                <option value="">Select a level</option>
                <option value="Level 1">Level 1</option>
                <option value="Level 2">Level 2</option>
                <option value="Level 3">Level 3</option>
                <ErrorMessage name="level" component="div" />
              </CustomSelectInput>
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
            </div>

            <div>
              <CustomEditor
                label="Thông tin chi tiết"
                name="description"
                id="description"
              >
                <ErrorMessage name="description" component="div" />
              </CustomEditor>
            </div>

            <div className="flex justify-end gap-2">
              <Button className="p-2 bg-red-500 text-white" type="button" severity="danger" onClick={() => setVisibleUpdate(false)}>
                Hủy
              </Button>
              <Button className="p-2 bg-blue-500 text-white" type="submit">Cập nhật</Button>
            </div>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
}
