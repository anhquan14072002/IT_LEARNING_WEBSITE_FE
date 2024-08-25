import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { Dropdown } from "primereact/dropdown";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import restClientV2 from "../../services/restClientV2";

const validationSchema = Yup.object({
  language: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function AddLanguage({ visible, setVisible, toast, fetchData }) {
  const [initialValues, setInitialValues] = useState({
    language: {},
  });
  const [languageList, setLanguageList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    restClientV2 ({
      url: `languages`,
      method: "GET",
    })
      .then((res) => {
        setLanguageList(res?.data || []);
      })
      .catch((err) => {
        setLanguageList([]);
      });
  }, []);

  // useEffect(() => {
  //   restClient({ url: "api/document/getalldocument", method: "GET" })
  //     .then((res) => {
  //       setDocumentList(Array.isArray(res.data.data) ? res.data.data : []);
  //     })
  //     .catch((err) => {
  //       setDocumentList([]);
  //     });
  // }, []);

  const onSubmit = (values) => {
    setLoading(true);
    const model = {
        name: values?.language?.name,
        baseId :values?.language?.id,
      isActive: true,
    };
    restClient({
      url: "api/programlanguage/createprogramlanguage",
      method: "POST",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Thêm ngôn ngữ thành công");
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
      header="Thêm ngôn ngữ"
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
              <CustomDropdown
                customTitle="name"
                title="Chọn ngôn ngữ"
                label="Ngôn ngữ"
                name="language"
                id="language"
                options={languageList}
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
