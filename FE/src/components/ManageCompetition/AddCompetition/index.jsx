import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../shared/CustomTextInput";
import { Button } from "primereact/button";
import { ACCEPT, REJECT, removeVietnameseTones, SUCCESS } from "../../../utils";
import restClient from "../../../services/restClient";
import Loading from "../../Loading";
import CustomEditor from "../../../shared/CustomEditor";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
});

export default function AddCompetition({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const [loading, setLoading] = useState(true);
  const initialValues = {
    title: "",
    description: "",
  };

  const onSubmit = async (values) => {
    console.log(values.title);
    const data = {
      title: values.title,
      description: values.title,
      isActive: false,
    };
    await restClient({
      url: "api/competition/createcompetition",
      method: "POST",
      data: data,
    })
      .then((res) => {
        ACCEPT(toast, "Tạo Cuộc Thi Thành Công");
        fetchData();
        setVisible(false);
      })
      .catch((err) => {
        REJECT(toast, "Không tạo được ");
      });
  };

  return (
    <Dialog
      header="Thêm  Cuộc Thi"
      visible={visible}
      style={{ width: "30vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
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
              />
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
