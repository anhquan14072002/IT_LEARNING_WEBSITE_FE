import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { ACCEPT, REJECT, removeVietnameseTones, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { Dropdown } from "primereact/dropdown";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
});

export default function UpdateTag({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  toast,
  fetchData,
}) {
  const [loading, setLoading] = useState(true);
  const initialValues = {
    title: updateValue?.title,
  };
  const onSubmit = async (values) => {
    console.log(values.title);
    const data = {
      id: updateValue?.id,
      title: values.title,
      keyWord: removeVietnameseTones(values.title),
      isActive: updateValue?.isActive,
    };
    await restClient({
      url: "api/tag/updatetag",
      method: "PUT",
      data: data,
    })
      .then((res) => {
        ACCEPT(toast, "Tạo Tag Thành Công");
        fetchData();
        setVisibleUpdate(false);
      })
      .catch((err) => {
        REJECT(toast, "Tag đã có ");
      });
  };

  return (
    <Dialog
      header="Sửa Tag"
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
                  Sửa
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
