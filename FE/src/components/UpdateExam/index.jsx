import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import Loading from "../Loading";
import { getProvinceByName, getYearByYear, REJECT, SUCCESS, TYPE } from "../../utils";
import { FileUpload } from "primereact/fileupload";
import CustomDropdown from "../../shared/CustomDropdown";
import restClient from "../../services/restClient";
import { province } from "../../services/province";
import { MultiSelect } from "primereact/multiselect";
import { Dropdown } from "primereact/dropdown";
import { years } from "../../services/year";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";

const baseValidationSchema = Yup.object({
  competition: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => Object.keys(value).length !== 0)
    .required("Không bỏ trống trường này"),
  title: Yup.string()
    .required("Tiêu đề không được bỏ trống")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  province: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => Object.keys(value).length !== 0)
    .required("Không bỏ trống trường này"),
  year: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => Object.keys(value).length !== 0)
    .required("Không bỏ trống trường này"),
  grade: Yup.object().nullable(),
  level:  Yup.object().test("is-not-empty", "Không được để trống trường này", (value) => Object.keys(value).length !== 0)
  .required("Không bỏ trống trường này"),
});

export default function UpdateExam({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  types,
  toast,
  fetchData: propFetchData,
}) {
  const [files, setFiles] = useState([]);
  const [fileSolution, setFileSolution] = useState([]);
  const [provinceList, setProvinceList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [competitionList, setCompetitionList] = useState([]);
  const [gradeList, setGradeList] = useState([]);
  const [levelList, setLevelList] = useState([]);
  const [yearList, setYearList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState([]);
  const [initialValues, setInitialValues] = useState({
    competition: {},
    title: "",
    province: {},
    description: "",
    year: {},
    numberQuestion: "",
    grade: {},
    level: {}
  });

  useEffect(() => {
    const fetchDataFromApi = async () => {
      try {
        const [competitionResponse, gradeResponse, levelResponse] = await Promise.all([
          updateValue?.competitionId
            ? restClient({ url: `api/competition/getcompetitionbyid?id=${updateValue.competitionId}`, method: "GET" })
            : Promise.resolve(null),
          updateValue?.gradeId
            ? restClient({ url: `api/grade/getgradebyid/${updateValue.gradeId}?isInclude=false`, method: "GET" })
            : Promise.resolve(null),
          updateValue?.levelId
            ? restClient({ url: `api/level/getlevelbyid?id=${updateValue.levelId}`, method: "GET" })
            : Promise.resolve(null),
        ]);

        const competitionItem = competitionResponse?.data?.data || {};
        const gradeItem = gradeResponse?.data?.data || {};
        const levelItem = levelResponse?.data?.data || {};
        const provinceItem = getProvinceByName(updateValue?.province) || {};
        const yearItem = getYearByYear(updateValue?.year) || {};

        const [competitionListResponse, tagResponse, gradeListResponse, levelListResponse] = await Promise.all([
          restClient({ url: "api/competition/getallcompetition?status=true", method: "GET" }),
          restClient({ url: "api/tag/getalltag?status=true", method: "GET" }),
          restClient({ url: `api/grade/getallgradebylevelid?levelId=${updateValue?.levelId}`, method: "GET" }),
          restClient({ url: "api/level/getalllevel", method: "GET" }),
        ]);
        

        setCompetitionList(competitionListResponse?.data?.data || []);
        setTagList(tagResponse?.data?.data || []);
        setGradeList(gradeListResponse?.data?.data || []);
        setLevelList(levelListResponse?.data?.data || []);

        setInitialValues({
          competition: competitionItem,
          title: updateValue?.title || "",
          province: provinceItem,
          description: updateValue?.description || "",
          year: yearItem,
          numberQuestion: updateValue?.numberQuestion || "",
          grade: gradeItem,
          level: levelItem,
        });

        try {
          const tagTopic = await restClient({
            url: `api/exam/getexamidbytag/${updateValue?.id}`,
            method: "GET",
          });
          setTag(tagTopic?.data?.data || null);
        } catch (error) {
          setTag(null);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    if (years) setYearList(years);
    if (province?.data) setProvinceList(province.data);

    fetchDataFromApi();
  }, [updateValue, visibleUpdate]);

  const handleOnChangeLevel = async (e, helpers, setTouchedState, props) => {
    const level = e.target.value;

    if (!level || !level.id) {
      setGradeList([]);
      helpers.setValue({});
      setTouchedState(true);
      if (props.onChange) props.onChange(e);
      return;
    }

    helpers.setValue(level);
    setTouchedState(true);
    if (props.onChange) props.onChange(e);

    try {
      const res = await restClient({
        url: `api/grade/getallgradebylevelid?levelId=${level.id}`,
        method: "GET",
      });
      setGradeList(res.data.data || []);
    } catch (err) {
      setGradeList([]);
      console.error("Failed to fetch grades:", err);
    }
  };

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
    if (values.grade && values.grade.id) {
      formData.append("GradeId", values.grade.id);
    } else if (values.level && values.level.id) {
      formData.append("LevelId", values.level.id);
    }
    tag.forEach((item, index) => formData.append(`tagValues[${index}]`, item.keyWord));

    if (files.length > 0) formData.append("ExamEssayFileUpload", files[0]);
    if (fileSolution.length > 0) formData.append("ExamSolutionFileUpload", fileSolution[0]);

    try {
      await restClient({
        url: "api/exam/updateexam",
        method: "PUT",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });
      SUCCESS(toast, "Sửa đề thi thành công");
      resetForm();
      if (propFetchData) propFetchData(); // Ensure propFetchData is called if provided
    } catch (error) {
      console.error("Error updating exam:", error);
      REJECT(toast, "Sửa đề thi không thành công");
    } finally {
      setLoading(false);
      setVisibleUpdate(false);
      setTag([]);
    }
  };

  const onFileSelect = (e) => setFiles(e.files);
  const onFileSolutionSelect = (e) => setFileSolution(e.files);

  const validationSchema = types === 2
    ? baseValidationSchema.shape({
        numberQuestion: Yup.number().required("Không được bỏ trống"),
      })
    : baseValidationSchema;

  return (
    <Dialog
      header="Sửa Đề Thi"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => { setVisibleUpdate(false); setTag([]); }}
    >
      {loading ? (
        <Loading />
      ) : (
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
          enableReinitialize // Ensures Formik reinitializes when initialValues change
        >
          {(formik) => (
            <Form>
              <CustomTextInput
                label="Tiêu đề"
                id="title"
                name="title"
                type="text"
              />
              <CustomDropdown
                title="Chọn Cuộc Thi"
                label="Cuộc Thi"
                customTitle="title"
                id="competition"
                name="competition"
                options={competitionList}
              />
              <CustomDropdown
                title="Tỉnh"
                label="Tỉnh"
                customTitle="name"
                id="province"
                name="province"
                options={provinceList}
              />
              <CustomDropdown
                title="Năm"
                label="Năm"
                customTitle="year"
                id="year"
                name="year"
                options={yearList}
              />
              <CustomDropdownInSearch
                title="Cấp Học"
                label="Cấp Học"
                customTitle="title"
                id="level"
                name="level"
                options={levelList}
                handleOnChange={handleOnChangeLevel}
              />
              <CustomDropdown
                title="Lớp"
                label="Lớp"
                disabled={!gradeList || gradeList.length === 0}
                customTitle="title"
                id="grade"
                name="grade"
                options={gradeList}
                isNotRequired ="false"
              />
              <div>
                <span>Tag</span>
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
              {types === 2 && (
                <CustomTextInput
                  label="Số lượng câu hỏi"
                  id="numberQuestion"
                  name="numberQuestion"
                  type="number"
                />
              )}
              <CustomEditor
                label="Thông tin chi tiết"
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
                    url="/api/upload"
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760}
                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                    className="custom-file-upload mb-2"
                    onSelect={onFileSelect}
                  />
                  <h1>File Lời Giải</h1>
                  <FileUpload
                    name="demo[]"
                    url="/api/upload"
                    accept=".pdf, application/pdf"
                    maxFileSize={10485760}
                    emptyTemplate={<p className="m-0">Drag and drop files here to upload.</p>}
                    className="custom-file-upload mb-2"
                    onSelect={onFileSolutionSelect}
                  />
                </>
              )}
              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  onClick={() => { setVisibleUpdate(false); setTag([]); }}
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
