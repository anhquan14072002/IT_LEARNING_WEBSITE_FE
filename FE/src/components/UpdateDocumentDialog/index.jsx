import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import restClient from "../../services/restClient";
import { ACCEPT, REJECT, SUCCESS } from "../../utils";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  grade: Yup.object()
    .test("is-not-empty", "Lớp không được bỏ trống", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Lớp không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
});

export default function UpdateDocumentDialog({
  visibleUpdate,
  setVisibleUpdate,
  toast,
  updateValue,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    grade: {},
    description: "",
  });
  const [gradeList, setGradeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialValuesReady, setInitialValuesReady] = useState(false);

  useEffect(() => {
    const fetchGrades = async () => {
      try {
        const res = await restClient({
          url: "api/grade/getallgrade",
          method: "GET",
        });
        if (Array.isArray(res.data.data)) {
          setGradeList(res.data.data);
          const selectedDocument = res.data.data.find(
            (item) => Number(item.id) === Number(updateValue.gradeId)
          );
          setInitialValues({
            title: updateValue.title,
            description: updateValue.description,
            grade: selectedDocument || {},
          });
          setInitialValuesReady(true); // Data has been fetched and initial values are set
        }
      } catch (err) {
        setGradeList([]);
      }
    };

    if (visibleUpdate) {
      fetchGrades();
    }
  }, [visibleUpdate, updateValue]);

  const onSubmit = async (values, { setSubmitting }) => {
    setLoading(true);
    try {
      const model = {
        id: updateValue.id,
        title: values.title,
        gradeId: values.grade.id,
        description: values.description,
        isActive: true,
      };
      await restClient({
        url: "api/document/updatedocument",
        method: "PUT",
        data: model,
      });
      SUCCESS(toast, "Cập nhật tài liệu thành công");
      fetchData();
    } catch (err) {
      REJECT(toast, err.message);
    } finally {
      setLoading(false);
      setVisibleUpdate(false);
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      header="Cập nhật tài liệu"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => setVisibleUpdate(false)}
    >
      {loading ? (
        <Loading />
      ) : (
        initialValuesReady && (
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
            enableReinitialize={true}
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
                  title="Chọn lớp"
                  label="Lớp"
                  name="grade"
                  id="grade"
                  options={gradeList}
                />
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
                  <Button
                    className="p-2 bg-blue-500 text-white"
                    type="submit"
                    disabled={formik.isSubmitting}
                  >
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
