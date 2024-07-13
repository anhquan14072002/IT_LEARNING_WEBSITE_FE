import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import { REJECT, SUCCESS } from "../../utils";
import axios from "axios";
import { Dropdown } from "primereact/dropdown";
import { FileUpload } from "primereact/fileupload";

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  province: Yup.string().required("Không được để trống"),
  year: Yup.number()
    .required("Năm không được bỏ trống")
    .min(1900, "Năm phải lớn hơn hoặc bằng 1900"),
  numberQuestion: Yup.number().required("Không được bỏ trống"),
});

export default function AddExam({ visible, setVisible, toast, fetchData }) {
  const [files, setFiles] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const response = await axios.get("https://esgoo.net/api-tinhthanh/1/0.htm");
        setProvinceList(response?.data?.data || []);
      } catch (error) {
        console.error("Error fetching provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  const initialValues = {
    title: "",
    province: "",
    description: "",
    year: "",
    numberQuestion: "",
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("province", values.province);
      formData.append("description", values.description);
      formData.append("numberQuestion", values.numberQuestion);
      formData.append("year", values.year);
      formData.append("isActive", true);

      files.forEach((file) => {
        formData.append("files", file);
      });

      console.log("Submitting model:", values.title);

      const response = await axios.post("api/exam/createexam", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      SUCCESS(toast, "Thêm đề thi thành công");
      fetchData(); // Update the exam list

    } catch (error) {
      console.error("Error adding exam:", error);
      REJECT(toast, error.message);
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };

  return (
    <Dialog
      header="Thêm Đề Thi"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => setVisible(false)}
    >
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              <CustomTextInput label="Tiêu đề" name="title" type="text" />

              <Dropdown
                value={values.province}
                onChange={(e) => setFieldValue("province", e.value)}
                options={provinceList}
                optionLabel="name"
                placeholder="Chọn Tỉnh"
                className="w-full md:w-14rem"
              />

              <CustomTextInput label="Năm" name="year" type="number" />

              <CustomTextInput
                label="Số lượng câu hỏi"
                name="numberQuestion"
                type="number"
              />

              <CustomEditor label="Thông tin chi tiết" name="description">
                <ErrorMessage name="description" component="div" />
              </CustomEditor>

              <h1>Tải File</h1>
              <FileUpload
                name="demo[]"
                url={"/api/upload"}
                accept=".pdf, application/pdf"
                maxFileSize={10485760} // 10MB
                emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                className="custom-file-upload mb-2"
                onSelect={onFileSelect}
              />

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
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
