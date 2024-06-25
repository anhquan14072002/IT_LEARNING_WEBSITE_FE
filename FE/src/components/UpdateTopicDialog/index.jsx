import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import classNames from "classnames";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { ACCEPT, REJECT, SUCCESS } from "../../utils";
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

export default function UpdateTopicDialog({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  updateValue,
  fetchData,
}) {
  const [gradeList, setGradeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({
    title: "",
    objectives: "",
    description: "",
    document: {},
  });

  useEffect(() => {
    const fetchDocuments = async () => {
      setLoading(true);
      try {
        const res = await restClient({
          url: "api/document/getalldocument",
          method: "GET",
        });
        if (Array.isArray(res.data.data)) {
          setGradeList(res.data.data);
          const selectedDocument = res.data.data.find(
            (item) => Number(item.id) === Number(updateValue.documentId)
          );
          // Set initial values with selected document
          setInitialValues({
            title: updateValue.title,
            objectives: updateValue.objectives,
            description: updateValue.description,
            document: selectedDocument || {},
          });
        }
      } catch (err) {
        console.error("Error fetching documents:", err);
        setGradeList([]);
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchDocuments();
    }
  }, [visibleUpdate, updateValue.documentId]);

  const onSubmit = (values) => {
    const model = {
      id: updateValue.id,
      title: values.title,
      objectives: values.objectives,
      description: values.description,
      documentId: values.document.id,
      isActive: true,
    };
    restClient({
      url: "api/topic/updatetopic",
      method: "PUT",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Cập nhật chủ đề thành công");
        fetchData();
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        setVisibleUpdate(false);
      });
  };

  return (
    <Dialog
      header="Cập nhật chủ đề"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visibleUpdate) return;
        setVisibleUpdate(false);
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
                title="Chọn tài liệu"
                label="Tài liệu"
                name="document"
                id="document"
                options={gradeList}
              />

              {/* <CustomTextarea
                label="Mục tiêu chủ đề"
                name="objectives"
                id="objectives"
              >
                <ErrorMessage name="objectives" component="div" />
              </CustomTextarea> */}
              <CustomEditor
                label="Thông tin chi tiết"
                name="objectives"
                id="objectives"
              >
                <ErrorMessage name="objectives" component="div" />
              </CustomEditor>
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
