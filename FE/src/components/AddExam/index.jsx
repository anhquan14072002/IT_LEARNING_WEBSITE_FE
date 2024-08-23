import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import { REJECT, SUCCESS, TYPE } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import CustomDropdown from "../../shared/CustomDropdown";
import restClient from "../../services/restClient";
import { province } from "../../services/province";
import { MultiSelect } from "primereact/multiselect";
import "./index.css";
import { Dropdown } from "primereact/dropdown";
import { years } from "../../services/year";

const baseValidationSchema = Yup.object({
  competition: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  title: Yup.string()
    .required("Tiêu đề không được bỏ trống")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  province: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  year: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
  grade: Yup.object().test(
    "is-not-empty",
    "Không được để trống trường này",
    (value) => {
      return Object.keys(value).length !== 0;
    }
  ),
});

export default function AddExam({
  visible,
  setVisible,
  toast,
  fetchData,
  types,
}) {
  const [files, setFiles] = useState([]);
  const [fileSolution, setFileSolution] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [seletedGrade, setSeletedGrade] = useState(null);
  const [tagList, setTagList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [tag, setTag] = useState(null);
  const [yearList, setYearList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch competition list
        const competitionResponse = await restClient({
          url: "api/competition/getallcompetition",
          method: "GET",
        });
        console.log(competitionResponse?.data?.data);
        setCompetitionList(
          Array.isArray(competitionResponse?.data?.data)
            ? competitionResponse?.data?.data
            : []
        );

        // Fetch tag list
        const tagResponse = await restClient({
          url: "api/tag/getalltag",
          method: "GET",
        });
        console.log(tagResponse?.data?.data);
        setTagList(
          Array.isArray(tagResponse?.data?.data) ? tagResponse?.data?.data : []
        );

        // Fetch grade list
        const gradeResponse = await restClient({
          url: "api/grade/getallgrade?isInclude=false",
          method: "GET",
        });
        console.log(gradeResponse?.data?.data);
        setGradeList(
          Array.isArray(gradeResponse?.data?.data)
            ? gradeResponse?.data?.data
            : []
        );
      } catch (error) {
        console.error("An error occurred:", error);
      }
    };
    if (province?.data) {
      setProvinceList(province.data);
    }

    // Call the fetchData function
    fetchData();
  }, [province]);

  const [initialValues, setInitialValues] = useState({
    competition: {},
    title: "",
    province: {},
    description: "",
    year: {},
    numberQuestion: "",
    files: [],
    grade: {},
  });
  useEffect(() => {
    if (years) {
      setYearList(years);
    }
  });

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    console.log(files);

    const formData = new FormData();
    formData.append("Type", types);
    formData.append("CompetitionId", values.competition.id);
    formData.append("Title", values.title);
    formData.append("Province", values.province.name);
    formData.append("Description", values.description);
    formData.append("NumberQuestion", values.numberQuestion || 0);
    formData.append("Year", values.year.year);
    formData.append("isActive", false);
    formData.append("GradeId", values.grade.id);
    if (tag && tag.length > 0) {
      tag.forEach((item, index) => {
        formData.append(`tagValues[${index}]`, item.keyWord);
      });
    }
    formData.append("ExamEssayFileUpload", files[0]);
    formData.append("ExamSolutionFileUpload", fileSolution[0]);
    try {
      const response = await restClient({
        url: "api/exam/createexam",
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setTag([]);
      SUCCESS(toast, "Thêm đề thi thành công");
      setSeletedGrade([]);
      resetForm(); // Reset form fields
      fetchData(); // Update the exam list
    } catch (error) {
      console.error("Error adding exam:", error);
      setTag([]);
      setSeletedGrade([]);
      REJECT(toast, "Thêm đề thi không thành công ");
    } finally {
      setLoading(false);
      setVisible(false);
    }
  };
  useEffect(() => {
    console.log("Current files value:", files);
  }, [files]);

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
      : baseValidationSchema.shape({
          files: Yup.array()
            .min(1, "File đề bài là bắt buộc")
            .required("Không được bỏ trống trường này"),
        });
  return (
    <Dialog
      header="Thêm Đề Thi"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => (setVisible(false), setTag([]))}
    >
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ setFieldValue, errors, touched }) => (
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
                title="Chọn Cuộc Thi"
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
                title="Lớp"
                label={
                  <>
                    <span>Lớp</span>
                  </>
                }
                is
                customTitle="title"
                id="grade"
                name="grade"
                isNotRequired="false"
                options={gradeList}
              />

              <CustomDropdown
                title="Tỉnh"
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
                  <span>Tag</span>
                </>
                <MultiSelect
                  value={tag}
                  options={tagList}
                  onChange={(e) => setTag(e.value)}
                  optionLabel="title"
                  placeholder="Chọn Tag"
                  className="w-full shadow-none custom-multiselect border border-gray-300"
                  display="chip"
                  filter
                />
              </div>
              <CustomDropdown
                title="Năm"
                label={
                  <>
                    <span>Năm</span>
                  </>
                }
                customTitle="year"
                id="year"
                name="year"
                options={yearList}
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
                  <h1>
                    File Đề Bài <span style={{ color: "red" }}>*</span>
                  </h1>
                  <Field name="files">
                    {({ field }) => (
                      <FileUpload
                        name="ExamFileUpload"
                        accept=".pdf"
                        maxFileSize={10485760} // 10MB
                        emptyTemplate={
                          <p className="m-0">
                            Kéo và thả file vào đây để tải lên.
                          </p>
                        }
                        className="custom-file-upload mb-2"
                        onSelect={(e) => {
                          setFieldValue("files", e.files);
                          onFileSelect(e);
                        }}
                        onClear={() => {
                          setFieldValue("files", []);
                          setFiles([]);
                        }}
                      />
                    )}
                  </Field>
                  {errors.files && touched.files && (
                    <div className="p-error">{errors.files}</div>
                  )}
                  <h1>File Đề Lời Giải</h1>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760} // 10MB
                    emptyTemplate={
                      <p className="m-0">Kéo và thả file vào đây để tải lên.</p>
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
