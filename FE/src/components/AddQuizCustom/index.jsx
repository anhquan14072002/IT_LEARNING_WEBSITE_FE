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
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

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

export default function AddQuizLesson({
  visible,
  setVisible,
  toast,
  fetchData,
}) {
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    score: null,
    type: {},
  });
  const [loading, setLoading] = useState(false);

  //custom
  const [typeQuiz, setTypeQuiz] = useState([]);
  const [quizList, setQuizList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState([]);
  const [realQuizList, setRealQuizList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch type quizzes
        const typeQuizResponse = await restClient({
          url: `api/enum/gettypequiz`,
          method: "GET",
        });
        const transformedData = typeQuizResponse?.data?.data?.map((item) => ({
          title: item?.name,
          id: item?.value,
        }));
        setTypeQuiz(transformedData);

        const res = await restClient({
          url: "api/quiz/getallquiz",
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
          setQuizList([]);
          setRealQuizList([]);
        }
      } catch (error) {
        // Handle errors for both requests
        console.error("Error fetching data:", error);
        setTypeQuiz([]);
        setListGrade([]);
        setTypeQuiz([]);
        setQuizList([]);
        setRealQuizList([]);
      }
    };

    // Call the fetchData function when the component mounts (empty dependency array)
    fetchData();
  }, []);

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
    if (!selectedProduct || selectedProduct.length === 0) {
      REJECT(toast, "Vui lòng không để trống lấy câu hỏi");
    } else {
      let model = {
        title: values?.title,
        score: values?.score,
        type: values?.type?.id,
        description: values?.description,
        isActive: true,
      };
      restClient({
        url: "api/quiz/createquiz",
        method: "POST",
        data: model,
      })
        .then((res) => {
          // SUCCESS(toast, "Thêm bài quiz thành công");
          restClient({
            url: "api/quizquestionrelation/createquizquestionrelationbyquizcustom",
            method: "POST",
            data: generateResponseBody(res?.data?.data?.id),
          })
            .then((res) => {
              ACCEPT(toast, "Thêm thành công");
            })
            .catch((err) => {
              // REJECT(toast, "Xảy ra lỗi khi thêm 1 ");
            })
            .finally(() => {
              setQuizList([]);
              setSelectedProduct([]);
              setRealQuizList([]);
            });
        })
        .catch((err) => {
          REJECT(toast, "Xảy ra lỗi khi thêm");
        })
        .finally(() => {
          setVisible(false);
          fetchData();
        });
    }
  };

  return (
    <Dialog
      header="Thêm bộ câu hỏi"
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
                label="Tiêu đề"
                name="title"
                type="text"
                id="title"
              />

              <CustomDropdown
                title="Thể loại"
                label="Thể loại"
                name="type"
                id="type"
                options={typeQuiz}
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

              {/* custom quiz */}
              <div>
                <h1>
                  Lấy câu hỏi <span className="text-red-600">*</span>
                </h1>
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
                  onClick={() => {
                    setVisible(false);
                    setQuizList([]);
                    setSelectedProduct([]);
                    setRealQuizList([]);
                  }}
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
