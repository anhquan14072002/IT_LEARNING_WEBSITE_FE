import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../../shared/CustomTextInput";
import CustomSelectInput from "../../../shared/CustomSelectInput";
import CustomTextarea from "../../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../../utils";
import restClient from "../../../services/restClient";
import Loading from "../../Loading";
import CustomDropdown from "../../../shared/CustomDropdown";
import { Dropdown } from "primereact/dropdown";

const validationSchema = Yup.object({
  fistName: Yup.string().required("Họ không được bỏ trống"),
  lastName: Yup.string().required("Tên không được bỏ trống"),
  username: Yup.string().required("Tài Khoản không được bỏ trống"),
  email: Yup.string()
    .email("Email không hợp lệ")
    .required("Email không được bỏ trống"),
  password: Yup.string().required("Mật Khẩu không được bỏ trống"),
  confirmPassword: Yup.string()
    .required("Nhập lại mật khẩu không được bỏ trống")
    .oneOf([Yup.ref("password"), null], "Mật khẩu không khớp"),
  role: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function AddUser({
  visible,
  setVisible,
  toast,
  fetchData,
  roleList,
}) {
  console.log(roleList);

  const initialValues = {
    fistName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: {},
  };
  const [loading, setLoading] = useState(false);

  const onSubmit = (values) => {
    setLoading(true);
    console.log(values);

    const model = {
      fistName: values.fistName,
      lastName: values.lastName,
      username: values.username,
      email: values.email,
      password: values.password,
      confirmPassword: values.confirmPassword,
      roleString: values.role.baseName,
    };
    restClient({
      url: "api/admin/register",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Tạo tài khoản thành công");
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, "Tạo tài khoản không thành công");
        setLoading(false);
      })
      .finally(() => {
        setVisible(false);
      });
  };


  return (
    <Dialog
      header="Thêm Nguời Dùng"
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
                label="Họ"
                name="fistName"
                type="text"
                id="fistName"
              />
              <CustomTextInput
                label="Tên"
                name="lastName"
                type="text"
                id="lastName"
              />
              <CustomTextInput
                label="Tài Khoản"
                name="username"
                type="text"
                id="username"
              />
              <CustomTextInput
                label="Email"
                name="email"
                type="text"
                id="email"
              />
              <CustomTextInput
                label="Mật Khẩu"
                name="password"
                type="password"
                id="password"
              />
              <CustomTextInput
                label="Nhập Lại Mật Khẩu "
                name="confirmPassword"
                type="password"
                id="confirmPassword"
              />
              <CustomDropdown
                title="Vai trò" 
                label="Vai trò" 
                name="role" 
                id="role" 
                customTitle = "name"
                options={roleList} 
                placeholder="Chọn vai trò" />

              <div className="flex justify-end gap-2 mt-3">
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
