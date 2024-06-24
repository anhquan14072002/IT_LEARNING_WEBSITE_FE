import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import "./index.css";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  gradeId: Yup.string().required("Lớp không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
});

export default function AddDocumentDialog({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const initialValues = {
    title: "",
    gradeId: "",
    description: "",
  };
  const [gradeList, setGradeList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    restClient({ url: "api/grade/getallgrade", method: "GET" })
      .then((res) => {
        setGradeList(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        setGradeList([]);
      });
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    const model = { ...values, isActive: true };
    restClient({
      url: "api/document/createdocument",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Thêm tài liệu thành công");
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        setVisible(false);
      });
  };

  return (
    <Dialog
      header="Thêm tài liệu"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      {loading === true ? (
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
                label="Lớp"
                name="gradeId"
                id="gradeId"
                flexStyle="flex-1"
              >
                <option value="">Chọn lớp</option>
                {gradeList &&
                  gradeList.map((grade) => (
                    <option key={grade.id} value={grade.id}>
                      {grade.title}
                    </option>
                  ))}
                <ErrorMessage name="gradeId" component="div" />
              </CustomSelectInput>

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
      )}
    </Dialog>
  );
}
