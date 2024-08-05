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

const validationSchema = Yup.object({
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  score: Yup.number()
    .required("Điểm không được bỏ trống và lớn hơn 0")
    .min(0, "Điểm phải lớn hơn hoặc bằng 0"),
  type: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function UpdateQuizCustom({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  toast,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    score: null,
    type: {},
  });
  const [documentList, setDocumentList] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeList, setListGrade] = useState([]);
  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);
  const [clearLesson, setClearLesson] = useState(false);
  const [lessonList, setLessonList] = useState([]);
  const [typeList, setTypeList] = useState([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // console.log(updateValue);
        // if (updateValue && updateValue.lessonId) {
        //   const lessonById = await restClient({
        //     url: `api/lesson/getlessonbyid/${updateValue.lessonId}`,
        //     method: "GET",
        //   });
        //   const lessonByIdData = lessonById.data?.data || {};

        //   setInitialValues((prevValues) => ({
        //     ...prevValues,
        //     lesson: lessonByIdData,
        //   }));
        // } else {
        //   setInitialValues((prevValues) => ({
        //     ...prevValues,
        //     lesson: {},
        //   }));
        // }

        // Fetch type quizzes
        const typeQuizResponse = await restClient({
          url: `api/enum/gettypequiz`,
          method: "GET",
        });
        const transformedData = typeQuizResponse?.data?.data?.map((item) => ({
          title: item?.name,
          id: item?.value,
        }));
        setTypeList(transformedData);

        const typeFind = transformedData?.find(
          (item, index) => item?.title === updateValue?.type
        );

        // const topicById = await restClient({
        //   url: `api/topic/gettopicbyid?id=${updateValue.topicId}`,
        //   method: "GET",
        // });
        // const selectTopicById = topicById.data?.data || {};

        // const documentById = await restClient({
        //   url: `api/document/getdocumentbyid/${selectTopicById.documentId}`,
        //   method: "GET",
        // });
        // const documentByIdData = documentById.data?.data || {};

        // const gradeById = await restClient({
        //   url: `api/grade/getgradebyid/${documentByIdData.gradeId}`,
        //   method: "GET",
        // });
        // const gradeByIdData = gradeById.data?.data || {};

        setInitialValues((prevValues) => ({
          ...prevValues,
          title: updateValue.title,
          // grade: gradeByIdData,
          description: updateValue.description,
          // document: documentByIdData,
          score: updateValue.score,
          // topic: selectTopicById,
          type: typeFind,
        }));

        // const gradeAllResponse = await restClient({
        //   url: `api/grade/getallgrade`,
        //   method: "GET",
        // });
        // const listGrade = gradeAllResponse.data?.data || [];
        // setListGrade(listGrade);

        // const documentData = await restClient({
        //   url: `api/document/getalldocumentbygrade/${gradeByIdData.id}`,
        //   method: "GET",
        // });
        // const documentRes = documentData.data?.data || {};
        // setDocumentList(documentRes);

        // const topicData = await restClient({
        //   url: `api/topic/getalltopicbydocument/${documentByIdData.id}`,
        //   method: "GET",
        // });
        // const dataTopic = topicData.data?.data || {};
        // setListTopic(dataTopic);

        // const lessonData = await restClient({
        //   url: `api/lesson/getalllessonbytopic/${selectTopicById.id}`,
        //   method: "GET",
        // });
        // const dataLesson = lessonData.data?.data || {};
        // setLessonList(dataLesson);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchInitialData();
    }
  }, [visibleUpdate, updateValue]);

  const onSubmit = (values) => {
    // {
    //     "title": "string",
    //     "description": "string",
    //     "score": 0,
    //     "isActive": true,
    //     "topicId": 0,
    //     "lessonId": 0
    //   }
    let model = {
      id: updateValue?.id,
      title: values?.title,
      type: values?.type?.id,
      description: values.description,
      score: values.score,
      isActive: true,
    };

    restClient({
      url: "api/quiz/updatequiz",
      method: "PUT",
      data: model,
    })
      .then((res) => {
        SUCCESS(toast, "Cập nhật bài quiz thành công");
        fetchData();
        setLoading(false);
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        setVisibleUpdate(false);
      });
  };

  return (
    <Dialog
      header="Cập nhật bài quiz"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visibleUpdate) return;
        setVisibleUpdate(false);
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
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />
              <CustomDropdown
                title="Thể loại"
                label="thể loại"
                name="type"
                id="type"
                options={typeList}
              />

              <CustomTextInput
                label="Điểm"
                name="score"
                type="number"
                id="score"
              />

              <div>
                <CustomEditor
                  label="Thông tin chi tiết"
                  name="description"
                  id="description"
                >
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  className="p-2 bg-red-500 text-white"
                  type="button"
                  severity="danger"
                  onClick={() => setVisibleUpdate(false)}
                >
                  Hủy
                </Button>
                <Button className="p-2 bg-blue-500 text-white" type="submit">
                  Cập nhật
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      )}
    </Dialog>
  );
}
