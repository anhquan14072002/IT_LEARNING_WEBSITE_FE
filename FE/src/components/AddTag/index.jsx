import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import { Button } from "primereact/button";
import { ACCEPT, REJECT, removeVietnameseTones, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
});

export default function AddTag({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const[loading,setLoading] = useState(true)
  const initialValues= ({
  title:""
  });
  


  const onSubmit = async(values) => {
    console.log(values.title);
    const data = {
      title: values.title,
      keyWord: removeVietnameseTones(values.title),
      isActive:false
    }
    await restClient({
      url:'api/tag/createtag',
      method:"POST",
      data:data
    })
    .then((res) => {
      ACCEPT(toast, "Tạo Tag Thành Công");
      fetchData();
      setVisible(false);
    })
    .catch((err) => {
      REJECT(toast, "Tag đã có ");
    })
  };

  
  return (
    <Dialog
      header="Thêm  Tag"
      visible={visible}
      style={{ width: "30vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
      }}
    >
      {loading === false     ? (
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
