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
});

export default function AddUser({
  visible,
  setVisible,
  toast,
  fetchData,
  roleList,
}) {
  const [role, setRole] = useState(null);

  const initialValues = {
    fistName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  };
  const [loading, setLoading] = useState(false);
  console.log(roleList);

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
      roleString:role
    };
    restClient({
      url: "api/admin/register",
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
  const handleSearch = (text) => {
    setRole(text);
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
              <span>Vai trò</span>
              <Dropdown
                value={role}
                onChange={(e) => handleSearch(e.value)}
                options={roleList}
                optionLabel="title"
                showClear
                placeholder="Vai trò"
                className="w-full rounded-l shadow-none  border border-gray-300"
              />

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
