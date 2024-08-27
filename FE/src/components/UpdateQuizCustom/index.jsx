import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import CustomSelectInput from "../../shared/CustomSelectInput";
import CustomTextarea from "../../shared/CustomTextarea";
import { Button } from "primereact/button";
import CustomEditor from "../../shared/CustomEditor";
import { ACCEPT, getTokenFromLocalStorage, REJECT, SUCCESS } from "../../utils";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { Dropdown } from "primereact/dropdown";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import { MultiSelect } from "primereact/multiselect";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

const validationSchema = Yup.object({
  title: Yup.string()
    .trim()
    .required("Tiêu đề không được bỏ trống")
    .min(5, "Tiêu đề phải có ít nhất 5 ký tự")
    .max(50, "Tiêu đề không được vượt quá 50 ký tự"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  type: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  grade: Yup.object()
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
    type: {},
    grade: {},
  });
  const [documentList, setDocumentList] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gradeList, setGradeList] = useState([]);
  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);
  const [clearLesson, setClearLesson] = useState(false);
  const [lessonList, setLessonList] = useState([]);
  const [typeList, setTypeList] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [realQuizList, setRealQuizList] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [tag, setTag] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState([]);

  //choose custom question
  const check1 = (rowData) => {
    return (
      <input
        id={`${rowData?.id}check1`}
        type="checkbox"
        checked={selectedProduct.some((item) => item.id === rowData.id)}
        onChange={() => handleCheckboxChange(rowData)}
      />
    );
  };

  const check2 = (rowData) => {
    return (
      <input
        id={`${rowData?.id}check2`}
        type="checkbox"
        onChange={() => handleCheckboxChange2(rowData)}
      />
    );
  };

  const handleCheckboxChange2 = (rowData) => {
    setQuizList((prevQuizList) => {
      // Determine if the item is already selected
      const isAlreadySelected = selectedProduct.some(
        (item) => item.id === rowData.id
      );

      const updatedQuizList = prevQuizList.map((item) =>
        item.id === rowData.id
          ? {
              ...item,
              shuffle: isAlreadySelected ? !item.shuffle : !rowData.shuffle,
            }
          : item
      );

      if (isAlreadySelected) {
        setSelectedProduct((prevSelected) =>
          prevSelected.map((item) =>
            item.id === rowData.id ? { ...item, shuffle: !item.shuffle } : item
          )
        );
      }

      return updatedQuizList;
    });
  };

  const handleCheckboxChange = (rowData) => {
    setSelectedProduct((prevSelected) =>
      prevSelected.some((item) => item.id === rowData.id)
        ? prevSelected.filter((item) => item.id !== rowData.id)
        : [...prevSelected, rowData]
    );
  };

  const handleInputChange = (e, index, rowData) => {
    const newValue = Number(e.target.value);

    // Ensure the new value is within the valid range
    const totalQuestion = realQuizList[index]?.totalQuestion || 0;
    const validatedValue = Math.max(1, Math.min(newValue, totalQuestion));

    // Update quizList with new value
    setQuizList((prevQuizList) => {
      const updatedQuizList = prevQuizList.map((item) =>
        item.id === rowData.id
          ? { ...item, totalQuestion: validatedValue }
          : item
      );

      // Update selectedProduct with new totalQuestion value if the item is selected
      setSelectedProduct((prevSelected) =>
        prevSelected.map((item) =>
          item.id === rowData.id
            ? { ...item, totalQuestion: validatedValue }
            : item
        )
      );

      return updatedQuizList;
    });
  };

  const inputTotal = (rowData, { rowIndex }) => {
    return (
      <input
        type="number"
        value={rowData?.totalQuestion || ""}
        className="outline-none border border-gray-300 p-1"
        onChange={(e) => handleInputChange(e, rowIndex, rowData)}
      />
    );
  };

  useEffect(() => {
    restClient({
      url: `api/grade/getallgrade?isInclude=false`,
      method: "GET",
    })
      .then((res) => {
        setGradeList(res.data.data || []);
      })
      .catch((err) => {
        setGradeList([]);
      });
  }, []);
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

        const res = await restClient({
          url: "api/quiz/getallquiznopagination?Custom=3",
          method: "GET",
        });

        if (Array.isArray(res?.data?.data)) {
          setQuizList(
            res?.data?.data?.filter((item) => Number(item?.totalQuestion) > 0)
          );
          setRealQuizList(
            res?.data?.data?.filter((item) => Number(item?.totalQuestion) > 0)
          );
        } else {
          setRealQuizList([]);
          setQuizList([]);
        }

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
          (item, index) => item?.id === updateValue?.typeId
        );

        try {
          const tagTopic = await restClient({
            url: `api/quiz/getquizidbytag/${updateValue?.id}`,
            method: "GET",
          });
          setTag(tagTopic?.data?.data || null);
        } catch (error) {
          setTag(null);
        }

        const tagResponse = await restClient({
          url: "api/tag/getalltag",
          method: "GET",
        });
        console.log(tagResponse?.data?.data);
        setTagList(
          Array.isArray(tagResponse?.data?.data) ? tagResponse?.data?.data : []
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

        const gradeById = await restClient({
          url: `api/grade/getgradebyid/${updateValue?.gradeId}`,
          method: "GET",
        });
        const gradeByIdData = gradeById.data?.data || {};

        setInitialValues((prevValues) => ({
          ...prevValues,
          title: updateValue.title,
          grade: gradeByIdData,
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

  const generateResponseBody = (id) => {
    return {
      quizId: id,
      quiQuestionRelationCustomCreate: selectedProduct?.map((item) => ({
        quizChildId: item?.id,
        numberOfQuestion: item?.totalQuestion || 0,
        shuffle: item?.shuffle || false, // Using the shuffle property value
      })),
    };
  };

  const onSubmit = (values) => {
    // {
    //     "title": "string",
    //     "description": "string",
    //     "score": 0,
    //     "isActive": true,
    //     "topicId": 0,
    //     "lessonId": 0
    //   }

    const tagValues = (tag || []).map((item) => item.keyWord);

    let model = {
      id: updateValue?.id,
      title: values?.title,
      type: values?.type?.id,
      description: values.description,
      score: 10,
      isActive: true,
      tagValues: tagValues,
      gradeId: values?.grade?.id,
    };

    restClient({
      url: "api/quiz/updatequiz",
      method: "PUT",
      data: model,
    })
      .then((res) => {
        restClient({
          url: "api/quizquestionrelation/createquizquestionrelationbyquizcustom",
          method: "POST",
          data: generateResponseBody(res?.data?.data?.id),
        })
          .then((res) => {
            setTag(null);
          })
          .catch((err) => {
            // REJECT(toast, "Xảy ra lỗi khi thêm 1 ");
          })
          .finally(() => {
            setSelectedProduct([]);
            SUCCESS(toast, "Cập nhật bộ đề thành công");
            fetchData();
            setTag(null);
            setLoading(false);
          });
      })
      .catch((err) => {
        REJECT(toast, err.message);
        setLoading(false);
      })
      .finally(() => {
        setVisibleUpdate(false);
        setTag();
      });
  };

  return (
    <Dialog
      header="Cập nhật bộ đề"
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
                title="Lớp"
                label="Lớp"
                name="grade"
                id="grade"
                options={gradeList}
              />
              <CustomDropdown
                title="Thể loại"
                label="thể loại"
                name="type"
                id="type"
                options={typeList}
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

              <div>
                <CustomEditor
                  label="Thông tin chi tiết"
                  name="description"
                  id="description"
                >
                  <ErrorMessage name="description" component="div" />
                </CustomEditor>
              </div>

              {/* custom quiz */}
              <div>
                <h1>Lấy câu hỏi</h1>
                <DataTable
                  value={quizList}
                  className="border-t-2"
                  scrollable
                  scrollHeight="30rem"
                >
                  <Column
                    style={{ minWidth: "3rem" }}
                    body={check1}
                    className="border-b-2 border-t-2 custom-checkbox-column"
                  />
                  <Column
                    field="title"
                    style={{ minWidth: "15rem" }}
                    header="Bộ câu hỏi"
                    className="border-b-2 border-t-2"
                  />
                  <Column
                    style={{ minWidth: "5rem" }}
                    header="Lấy ngẫu nhiên"
                    body={check2} // If needed
                    className="border-b-2 border-t-2"
                  />
                  <Column
                    style={{ minWidth: "5rem" }}
                    body={inputTotal}
                    header="Tổng số câu hỏi"
                    className="border-b-2 border-t-2"
                  />
                </DataTable>
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
