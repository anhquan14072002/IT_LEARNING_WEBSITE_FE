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

export default function UpdateExam({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  types,
  toast,
  fetchData,
}) {
  console.log(updateValue?.gradeId);

  const [files, setFiles] = useState([]);
  const [fileSolution, setFileSolution] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [competitionById, setCompetitionById] = useState([]);
  const [gradeItem, setGradeItem] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);
  const [gradeList, setGradeList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [initialValues, setInitialValues] = useState({
    competition: {},
    title: "",
    province: {},
    description: "",
    year: {},
    numberQuestion: "",
    grade: {},
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const competitionPromise = updateValue?.competitionId
          ? restClient({
              url: `api/competition/getcompetitionbyid?id=${updateValue.competitionId}`,
              method: "GET",
            })
          : null;

        const gradePromise = updateValue?.gradeId
          ? restClient({
              url: `api/grade/getgradebyid/${updateValue?.gradeId}?isInclude=false`,
              method: "GET",
            })
          : null;

        const [competitionResponse, gradeResponse] = await Promise.all([
          competitionPromise,
          gradePromise,
        ]);

        if (competitionResponse) {
          setCompetitionById(competitionResponse?.data?.data || []);
        }

        if (gradeResponse) {
          console.log("+++++++++++++++++++++++++++++++++++++++++");
          console.log(gradeResponse?.data?.data);
          console.log(
            `api/grade/getgradebyid/${updateValue?.gradeId}?isInclude=false`
          );
          console.log("+++++++++++++++++++++++++++++++++++++++++");

          setGradeItem(gradeResponse?.data?.data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();

    if (years) {
      setYearList(years);
    }
  }, [updateValue, years]);

  useEffect(() => {
    const province = getProvinceByName(updateValue?.province);
    const year = getYearByYear(updateValue?.year);
    console.log(gradeItem);
    if (province && updateValue) {
      setYearList(year ? [year] : []); // Ensure `setYearList` gets an array of year objects
      setInitialValues(() => ({
        competition: competitionById,
        title: updateValue?.title || "",
        province: province,
        description: updateValue?.description || "",
        year: year || {}, // Ensure `year` is set to an object or default to empty object
        numberQuestion: updateValue?.numberQuestion || "",
        grade: gradeItem,
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
        setTagList(
          Array.isArray(tagResponse?.data?.data) ? tagResponse?.data?.data : []
        );

        // Fetch grade list
        const gradeResponse = await restClient({
          url: "api/grade/getallgrade?isInclude=false",
          method: "GET",
        });
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

  const onSubmit = async (values, { resetForm }) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("Id", updateValue.id);
    formData.append("Type", types);
    formData.append("CompetitionId", values.competition.id);
    formData.append("Title", values.title || "");
    formData.append("Province", values.province.name || "");
    formData.append("Description", values.description || "");
    formData.append("NumberQuestion", values.numberQuestion || 0);
    formData.append("Year", values.year.year || "");
    formData.append("isActive", updateValue?.isActive);
    if (tag && tag.length > 0) {
      tag.forEach((item, index) => {
        formData.append(`tagValues[${index}]`, item.keyWord);
      });
    }
    formData.append("ExamEssayFileUpload", files[0]);
    formData.append("ExamSolutionFileUpload", fileSolution[0]);
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
                title="Cuộc thi"
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
                isNotRequired="false"
                customTitle="title"
                id="grade"
                name="grade"
                options={gradeList}
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
                    maxFileSize={10485760}
                    emptyTemplate={
                      <p className="m-0">Drag and drop files here to upload.</p>
                    }
                    className="custom-file-upload mb-2"
                    onSelect={onFileSelect}
                  />
                  <h1>File Lời Giải</h1>
                  <FileUpload
                    name="demo[]"
                    url={"/api/upload"}
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760}
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
