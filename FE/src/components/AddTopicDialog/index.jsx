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
import { Dropdown } from "primereact/dropdown";
import CustomDropdown from "../../shared/CustomDropdown";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  objectives: Yup.string().required("Mục tiêu chủ đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  document: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function AddTopicDialog({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const initialValues = {
    title: "",
    objectives: "",
    description: "",
    document: {},
  };
  const [documentList, setDocumentList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    restClient({ url: "api/document/getalldocument", method: "GET" })
      .then((res) => {
        setDocumentList(Array.isArray(res.data.data) ? res.data.data : []);
      })
      .catch((err) => {
        setDocumentList([]);
      });
  }, []);

  const onSubmit = (values) => {
    setLoading(true);
    const model = {
      title: values.title,
      objectives: values.objectives,
      description: values.description,
      documentId: values.document.id,
      isActive: true,
    };
    restClient({
      url: "api/topic/createtopic",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Thêm chủ đề thành công");
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
      header="Thêm chủ đề"
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

              <CustomDropdown
                label="Tài liệu"
                name="document"
                id="document"
                options={documentList}
              />

              <CustomTextarea
                label="Mục tiêu chủ đề"
                name="objectives"
                id="objectives"
              >
                <ErrorMessage name="objectives" component="div" />
              </CustomTextarea>

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
