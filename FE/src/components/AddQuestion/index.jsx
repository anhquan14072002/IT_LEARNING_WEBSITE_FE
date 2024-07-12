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
  });

  const [typeList, settypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionLevel, setquestionLevelList] = useState([]);
  const [quizList, setquizListList] = useState([]);
  const [typeQuestion, setTypeQuestion] = useState("");

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
      const model = {
        type: values.type.typeName,
        content: values.content,
        isActive: true,
        questionLevel: values.questionLevel.levelName,
        quizId: values.quiz.id,
        quizAnswers: [
          {
            content: "Đúng",
            isCorrect: (QuestionTrueFalseValue) === true,
          },
          {
            content: "Sai",
            isCorrect: (QuestionTrueFalseValue) === false,
          },
        ],
      };
      console.log('====================================');
      console.log(model);
      console.log('====================================');
      restClient({
        url: "api/quizquestion/createquizquestion",
        method: "POST",
        data: model,
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

  // Define dynamic validation schema based on typeQuestion
  const validationSchema = Yup.object().shape({
    content: Yup.string().required("Nội dung không được bỏ trống"),
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
    QuestionTrueFalse: Yup.boolean().when("type", {
      is: (val) => val?.typeName === "QuestionTrueFalse", // Condition for validation
      then: Yup.boolean().required("Bạn phải chọn đáp án đúng"), // Validation rule
    }),
  });

  return (
    <Dialog
      header="Thêm câu hỏi"
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
                isClear={true}
                handleOnChange={handleChangeType}
                options={typeList}
              />

              {typeQuestion === "QuestionTrueFalse" && (
                <div className="mt-4">
                  <label
                    htmlFor="QuestionTrueFalse"
                    className="block text-sm font-medium text-gray-700"
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
