import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import { REJECT, SUCCESS } from "../../utils";

const AddQuestion = ({ visible, setVisible, toast, fetchData }) => {
  const [initialValues, setInitialValues] = useState({
    content: "",
    type: {},
    questionLevel: {},
    quiz: {},
    QuestionTrueFalse: undefined, // Initialize QuestionTrueFalse
    hint: "",
  });

  const [typeList, settypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionLevel, setquestionLevelList] = useState([]);
  const [quizList, setquizListList] = useState([]);
  const [typeQuestion, setTypeQuestion] = useState("");

  const shuffle = [
    { title: "Có trộn", valueTitle: true },
    { title: "Không trộn", valueTitle: false },
  ];

  useEffect(() => {
    const fetchFormData = async () => {
      setLoading(true);
      try {
        const typeListRes = await restClient({
          url: "api/enum/gettypequestion",
          method: "GET",
        });
        const typeData = typeListRes?.data?.data?.map((item) => ({
          title: item.name,
          typeName: item.value,
        }));

        const questionLevelRes = await restClient({
          url: "api/enum/getquestionlevel",
          method: "GET",
        });
        const questionLevelData = questionLevelRes?.data?.data?.map((item) => ({
          title: item.name,
          levelName: item.value,
        }));

        const quizListRes = await restClient({
          url: "api/quiz/getallquiz",
          method: "GET",
        });
        const quizListData = quizListRes?.data?.data;

        settypeList(typeData);
        setquestionLevelList(questionLevelData);
        setquizListList(quizListData);
      } catch (e) {
        settypeList([]);
        setquestionLevelList([]);
        setquizListList([]);
      } finally {
        setLoading(false);
      }
    };

    if (visible) {
      fetchFormData();
    }
  }, [visible]);

  const onSubmit = (values) => {
    if (!values.QuestionTrueFalse) {
      REJECT(toast, "Bạn phải chọn đáp án đúng");
    } else {
      const QuestionTrueFalseValue = values.QuestionTrueFalse === "true";

      // Create a new FormData object
      let formData = new FormData();

      // Append each field to the FormData object
      formData.append("type", values.type.typeName);
      formData.append("content", values?.content);
      formData.append("isActive", true); // Assuming isActive is a boolean
      formData.append("questionLevel", values?.questionLevel?.levelName);
      formData.append("IsShuffle", values?.shuffle?.valueTitle);
      formData.append("quizId", values?.quiz?.id);

      // [
      //   {
      //     content: "Đúng",
      //     isCorrect: values.QuestionTrueFalseValue === true,
      //   },
      //   {
      //     content: "Sai",
      //     isCorrect: values.QuestionTrueFalseValue === false,
      //   },
      // ].forEach((obj , index) => {
      //   formData
      // })

      formData.append("QuizAnswers",JSON.stringify( [
        {
          content: "Đúng",
          isCorrect: values.QuestionTrueFalseValue === true,
        },
        {
          content: "Sai",
          isCorrect: values.QuestionTrueFalseValue === false,
        },
      ]));
      
      

      restClient({
        url: "api/quizquestion/createquizquestion",
        method: "POST",
        data: formData,
      })
        .then((res) => {
          SUCCESS(toast, "Thêm câu hỏi thành công thành công");
          fetchData();
        })
        .catch((err) => {
          REJECT(toast, err.message);
        })
        .finally(() => {
          setVisible(false);
          setLoading(false);
        });
    }
  };

  const handleChangeType = (e, helpers, setTouchedState, props) => {
    setTypeQuestion(e?.value?.title); // Update typeQuestion based on selection

    const selectedType = {
      title: e?.value?.title,
      typeName: e?.value?.typeName,
    };
    helpers.setValue(selectedType);
    setTouchedState(true);

    if (props.onChange) {
      props.onChange(e);
    }
  };

  const handleChangeShuffle = (e, helpers, setTouchedState, props) => {
    helpers.setValue(e?.value);
    setTouchedState(true);

    if (props.onChange) {
      props.onChange(e);
    }
  };

  // Define dynamic validation schema based on typeQuestion
  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Nội dung không được bỏ trống"),
    shuffle: Yup.object().required("Không bỏ trống trường này"),
    hint: Yup.string().required("Giải thích đáp án không được bỏ trống"),
    type: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0;
      })
      .required("Không bỏ trống trường này"),
    questionLevel: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0;
      })
      .required("Không bỏ trống trường này"),
    quiz: Yup.object()
      .test("is-not-empty", "Không được để trống trường này", (value) => {
        return Object.keys(value).length !== 0;
      })
      .required("Không bỏ trống trường này"),
  });

  return (
    <Dialog
      header="Thêm câu hỏi"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visible) return;
        setVisible(false);
        setTypeQuestion("");
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
                title="Bài quiz"
                label="Bài quiz"
                name="quiz"
                id="quiz"
                options={quizList}
              />

              <CustomDropdown
                title="Mức độ"
                label="Mức độ"
                name="questionLevel"
                id="questionLevel"
                options={questionLevel}
              />

              <div>
                <CustomEditor
                  label="Thông tin chi tiết"
                  name="content"
                  id="content"
                />
              </div>

              <CustomDropdownInSearch
                title="Loại câu hỏi"
                label="Loại câu hỏi"
                name="type"
                id="type"
                isClear={false}
                handleOnChange={handleChangeType}
                options={typeList}
              />

              {typeQuestion === "QuestionTrueFalse" && (
                <>
                  <div className="my-4">
                    <label
                      htmlFor="QuestionTrueFalse"
                      className="block text-md text-gray-700"
                    >
                      Đáp án đúng
                    </label>
                    <div className="mt-1">
                      <label className="inline-flex items-center">
                        <Field
                          type="radio"
                          className="form-radio text-blue-500"
                          name="QuestionTrueFalse"
                          value="true" // Specify values as strings
                        />
                        <span className="ml-2">Đúng</span>
                      </label>
                      <label className="inline-flex items-center ml-6">
                        <Field
                          type="radio"
                          className="form-radio text-blue-500"
                          name="QuestionTrueFalse"
                          value="false" // Specify values as strings
                        />
                        <span className="ml-2">Sai</span>
                      </label>
                    </div>
                    <ErrorMessage
                      name="QuestionTrueFalse"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <CustomDropdownInSearch
                    title="Trộn đáp án"
                    label="Trộn đáp án"
                    name="shuffle"
                    id="shuffle"
                    isClear={false}
                    handleOnChange={handleChangeShuffle}
                    options={shuffle}
                  />
                  <div>
                    <div>
                      <CustomEditor
                        label="Giải thích đáp án"
                        name="hint"
                        id="hint"
                      />
                    </div>
                  </div>
                </>
              )}

              <div className="flex justify-end gap-2 mt-5">
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
};

export default AddQuestion;
