import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import { getProvinceByName, REJECT, SUCCESS, TYPE } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import CustomDropdown from "../../shared/CustomDropdown";
import restClient from "../../services/restClient";
import { province } from "../../services/province";
import { MultiSelect } from "primereact/multiselect";
// import "./index.css";

const baseValidationSchema = Yup.object({
  competition: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  province: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  year: Yup.number()
    .required("Năm không được bỏ trống")
    .min(1900, "Năm phải lớn hơn 1900")
    .integer("Năm phải là số nguyên")
    .test("len", "Sai định dạng năm", (val) => val.toString().length === 4),
});

export default function UpdateExam({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  types,
  toast,
  fetchData,
}) {
  const [files, setFiles] = useState([]);
  const [fileSolution, setFileSolution] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [competitionById, setCompetitionById] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);

  const [initialValues, setInitialValues] = useState({
    competition: {},
    title: "",
    province: {},
    description: "",
    year: "",
    numberQuestion: "",
  });
  useEffect(() => {
    const fetchData = async () => {
      if (updateValue?.competitionId) {
        try {
          const response = await restClient({
            url: `api/competition/getcompetitionbyid?id=${updateValue.competitionId}`,
            method: "GET",
          });
          console.log(response?.data?.data);
          setCompetitionById(response?.data?.data || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, [updateValue]);

  useEffect(() => {
    const province = getProvinceByName(updateValue?.province);
    console.log(province);
    console.log(competitionById);

    if (province && updateValue) {
      setProvinceList(province.data || []);
      setInitialValues(() => ({
        competition: competitionById,
        title: updateValue?.title || "",
        province,
        description: updateValue?.description || "",
        year: updateValue?.year || "",
        numberQuestion: updateValue?.numberQuestion || "",
      }));
    }
  }, [competitionById, updateValue]);
  useEffect(() => {
    if (province?.data) {
      setProvinceList(province.data);
    }
    const fetchData = async () => {
      try {
        const response = await restClient({
          url: "api/competition/getallcompetition",
          method: "GET",
        });
        console.log(response?.data?.data);
        setCompetitionList(
          Array.isArray(response?.data?.data) ? response?.data?.data : []
        );
      } catch (error) {
        console.log("error");
      }
    };

    const fetchDataTag = async () => {
      try {
        const response = await restClient({
          url: "api/tag/getalltag",
          method: "GET",
        });
        console.log(response?.data?.data);
        setTagList(
          Array.isArray(response?.data?.data) ? response?.data?.data : []
        );
      } catch (error) {
        console.log("error");
      }
    };
    fetchData();
    fetchDataTag();
  }, [province]);

  console.log(updateValue);

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("Id", updateValue.id);
    formData.append("Type", types);
    formData.append("CompetitionId", values.competition.id);
    formData.append("Title", values.title);
    formData.append("Province", values.province.name);
    formData.append("Description", values.description);
    formData.append("NumberQuestion", values.numberQuestion);
    formData.append("Year", values.year);
    formData.append("isActive", updateValue?.isActive);
    if (tag && tag.length > 0) {
      tag.forEach((item, index) => {
        formData.append(`tagValues[${index}]`, item.keyWord);
      });
    }
    formData.append("ExamEssayFileUpload", files);
    formData.append("ExamSolutionFileUpload", fileSolution);
    try {
      const response = await restClient({
        url: "api/exam/updateexam",
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTag([]);
      SUCCESS(toast, "Sửa đề thi thành công");
      resetForm(); // Reset form fields
      fetchData(); // Update the exam list
    } catch (error) {
      console.error("Error adding exam:", error);
      setTag([]);
      REJECT(toast, error.message);
    } finally {
      setLoading(false);
      setVisibleUpdate(false);
    }
  };

  const onFileSelect = (e) => {
    setFiles(e.files);
  };
  const onFileSolutionSelect = (e) => {
    setFileSolution(e.files);
  };
  const validationSchema =
    types === 2
      ? baseValidationSchema.shape({
          numberQuestion: Yup.number().required("Không được bỏ trống"),
        })
      : baseValidationSchema;

  return (
    <Dialog
      header=" Sửa Đề Thi"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => (setVisibleUpdate(false), setTag([]))}
    >
      {loading ? (
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
                  </>
                }
                id="title"
                name="title"
                type="text"
              />
              <CustomDropdown
                title={
                  updateValue?.competitionTitle
                    ? updateValue?.competitionTitle
                    : "Cuộc Thi"
                }
                label={
                  <>
                    <span>Cuộc Thi</span>
                  </>
                }
                customTitle="title"
                id="competition"
                name="competition"
                options={competitionList}
              />

              <CustomDropdown
                title={updateValue.province ? updateValue.province : "Tỉnh"}
                label={
                  <>
                    <span>Tỉnh</span>
                  </>
                }
                customTitle="name"
                id="province"
                name="province"
                options={provinceList}
              />
              <div>
                <>
                  <span>
                    Tag <span style={{ color: "red" }}>*</span>
                  </span>
                </>
                <MultiSelect
                  value={tag}
                  options={tagList}
                  onChange={(e) => setTag(e.value)}
                  optionLabel="title"
                  placeholder="Chọn Tag"
                  className="w-full shadow-none custom-multiselect border border-gray-300"
                  display="chip"
                  required
                />
              </div>
              <CustomTextInput
                label={
                  <>
                    <span>Năm</span>
                  </>
                }
                id="year"
                name="year"
                type="number"
              />
              {types === 2 && (
                <CustomTextInput
                  label={
                    <>
                      <span>Số lượng câu hỏi</span>
                    </>
                  }
                  id="numberQuestion"
                  name="numberQuestion"
                  type="number"
                />
              )}

              <CustomEditor
                label={
                  <>
                    <span>Thông tin chi tiết</span>
                  </>
                }
                id="description"
                name="description"
              >
                <ErrorMessage name="description" component="div" />
              </CustomEditor>
              {types === 1 && (
                <>
                  <h1>File Đề Bài</h1>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Drag and drop files here to upload.</p>
                    }
                    className="custom-file-upload mb-2"
                    onSelect={onFileSelect}
                  />
                  <h1>File Đề Lời Giải</h1>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Drag and drop files here to upload.</p>
                    }
                    className="custom-file-upload mb-2"
                    onSelect={onFileSolutionSelect}
                  />
                </>
              )}

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
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
