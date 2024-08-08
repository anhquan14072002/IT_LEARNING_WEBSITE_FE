import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import {
  getProvinceByName,
  getYearByYear,
  REJECT,
  SUCCESS,
  TYPE,
} from "../../utils";
import { FileUpload } from "primereact/fileupload";
import CustomDropdown from "../../shared/CustomDropdown";
import restClient from "../../services/restClient";
import { province } from "../../services/province";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { years } from "../../services/year";
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
  year: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0;
    })
    .required("Không bỏ trống trường này"),
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
  const [gradeTitle, setGradeTitle] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [seletedGrade, setSeletedGrade] = useState(updateValue.gradeId);
  const [yearList, setYearList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    competition: {},
    title: "",
    province: {},
    description: "",
    year: {},
    numberQuestion: "",
  });
  console.log(updateValue);

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
    const fetchDataGrade = async () => {
      if (updateValue?.gradeId) {
        try {
          const response = await restClient({
            url: `api/grade/getgradebyid/${updateValue?.gradeId}`,
            method: "GET",
          });
          console.log(response?.data?.data);
          setGradeTitle(response?.data?.data?.title || []);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };
    fetchData();
    fetchDataGrade();
  }, [updateValue]);
  useEffect(() => {
    if (years) {
      setYearList(years);
    }
  });

  useEffect(() => {
    const province = getProvinceByName(updateValue?.province);
    const year = getYearByYear(updateValue?.year);

    if (province && updateValue) {
      setProvinceList(province.data || []);
      setYearList(year ? [year] : []); // Ensure `setYearList` gets an array of year objects
      setInitialValues(() => ({
        competition: competitionById,
        title: updateValue?.title || "",
        province,
        description: updateValue?.description || "",
        year: year || {}, // Ensure `year` is set to an object or default to empty object
        numberQuestion: updateValue?.numberQuestion || "",
      }));
    }
  }, [competitionById, updateValue]);
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
          url: "api/grade/getallgrade",
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

  console.log(updateValue);

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);
    console.log(values);

    const formData = new FormData();
    formData.append("Id", updateValue.id);
    formData.append("Type", types);
    formData.append("CompetitionId", values.competition.id || "");
    formData.append("Title", values.title || "");
    formData.append("Province", values.province.name|| "");
    formData.append("Description", values.description || "");
    formData.append("NumberQuestion", values.numberQuestion || "");
    formData.append("Year", values.year.year || "");
    formData.append("isActive", updateValue?.isActive );
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
      REJECT(toast, "Sửa đề thi không thành công ");
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

  const handleGrade = (e) => {
    setSeletedGrade(e.value.title);
    setGradeValue(e.value.id);
  };

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
              <span>Lớp</span>
              <Dropdown
                value={seletedGrade}
                onChange={handleGrade}
                options={gradeList}
                optionLabel="title"
                editable
                placeholder={gradeTitle ? gradeTitle : "Lớp"}
                className="border border-gray-300 shadow-none  flex items-center w-full py-2 gap-2.5 "
                filter
              />
              {console.log(provinceList)}
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
              <CustomDropdown
                title={updateValue?.year ? updateValue?.year : "Năm"}
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
