import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../shared/CustomTextInput";
import { Button } from "primereact/button";
import { ACCEPT, REJECT, SUCCESS } from "../../../utils";
import restClient from "../../../services/restClient";
import Loading from "../../Loading";
import CustomEditor from "../../../shared/CustomEditor";

const validationSchema = Yup.object({
  title: Yup.string()
  .required("Tiêu đề không được bỏ trống")
  .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
  .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
description: Yup.string().required("Mô tả không được bỏ trống"),
});

export default function UpdateCompetition({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  toast,
  fetchData,
}) {
  const [loading, setLoading] = useState(true);
  const initialValues = {
    title: updateValue.title,
    description: updateValue.description,
  };

  const onSubmit = async (values) => {
    console.log(values.title);
    const data = {
      id: updateValue.id,
      title: values.title,
      description: values.description,
      isActive: updateValue.isActive,
    };
    await restClient({
      url: "api/competition/updatecompetition",
      method: "PUT",
      data: data,
    })
      .then((res) => {
        SUCCESS(toast, "Cập Nhật Cuộc Thi Thành Công");
        fetchData();
        setVisibleUpdate(false);
      })
      .catch((err) => {
        REJECT(toast, "Cập Nhật Cuộc Thi Thất Bại ");
      });
  };

  return (
    <Dialog
      header="Cập Nhật Cuộc Thi"
      visible={visibleUpdate}
      style={{ width: "30vw" }}
      onHide={() => {
        if (!visibleUpdate) return;
        setVisibleUpdate(false);
      }}
    >
      {loading === false ? (
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
                label={
                  <>
                    <span>Tiêu đề</span>
                    <span style={{ color: "red" }}>*</span>
                  </>
                }
                name="title"
                type="text"
                id="title"
              />
              <CustomEditor
                label={
                  <>
                    <span>Thông tin chi tiết</span>
                    <span style={{ color: "red" }}>*</span>
                  </>
                }
                id="description"
                name="description"
              ></CustomEditor>
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
                  Cập Nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
