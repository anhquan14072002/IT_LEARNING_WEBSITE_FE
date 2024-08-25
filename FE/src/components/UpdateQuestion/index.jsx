import React, { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Formik, Form, Field, ErrorMessage, setIn } from "formik";
import * as Yup from "yup";
import CustomEditor from "../../shared/CustomEditor";
import { Button } from "primereact/button";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import restClient from "../../services/restClient";
import Loading from "../Loading";
import {
  getTokenFromLocalStorage,
  handleMultipleContent,
  handleMultipleCorrect,
  hasCorrectAnswer,
  hasEmptyContent,
  REJECT,
  SUCCESS,
} from "../../utils";
import CustomTextInput from "../../shared/CustomTextInput";

const UpdateQuestion = ({
  visibleUpdate,
  setVisibleUpdate,
  updateValue,
  toast,
  fetchData,
}) => {
  const [initialValues, setInitialValues] = useState({
    content: "",
    type: {},
    questionLevel: {},
    QuestionTrueFalse: undefined, // Initialize QuestionTrueFalse
    hint: "",
  });

  const [typeList, settypeList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [questionLevel, setquestionLevelList] = useState([]);
  const [typeQuestion, setTypeQuestion] = useState(updateValue?.type || "");
  const [loadingForm, setLoadingForm] = useState(false);

  //answer of four answers
  const [fourAnswer, setFourAnswer] = useState([
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
    { content: "", isCorrect: false },
  ]);

  //answer of multple answers
  const [numberAnswerOfMultichoice, setNumberAnswerOfMultichoice] = useState(6);
  const [multipleAnswer, setMultipleAnswer] = useState([]);

  useEffect(() => {
    // Create new answers when numberAnswerOfMultichoice changes
    const newAnswers = Array.from(
      { length: numberAnswerOfMultichoice },
      (_, index) => ({
        content: "",
        isCorrect: false,
      })
    );
    setMultipleAnswer(newAnswers);
  }, [numberAnswerOfMultichoice]);

  const shuffle = [
    { title: "Có trộn", valueTitle: true },
    { title: "Không trộn", valueTitle: false },
  ];

  useEffect(() => {
    console.log(updateValue);
    
    const fetchFormData = async () => {
      console.log("typeQuestion::", typeQuestion);
      setLoading(true);

      try {
        // Fetch type list
        const typeListRes = await restClient({
          url: "api/enum/gettypequestion",
          method: "GET",
        });
        const typeData = typeListRes?.data?.data?.map((item) => ({
          title: item.name,
          typeName: item.value,
        }));

        // Fetch question level list
        const questionLevelRes = await restClient({
          url: "api/enum/getquestionlevel",
          method: "GET",
        });
        const questionLevelData = questionLevelRes?.data?.data?.map((item) => ({
          title: item.name,
          levelName: item.value,
        }));

        // Update state with fetched data
        settypeList(typeData);
        setquestionLevelList(questionLevelData);

        // Check if updateValue is available and typeList and questionLevel are populated
        if (
          visibleUpdate &&
          updateValue &&
          typeData.length > 0 &&
          questionLevelData.length > 0
        ) {
          try {
            setLoadingForm(true);
            setTypeQuestion(updateValue?.type);

            if (Number(updateValue?.type) === 1) {
              const typeObject = typeData.find(
                (item) => Number(item?.typeName) === 1
              );

              setInitialValues({
                content: updateValue.keyWord || "",
                type: typeObject || {},
                questionLevel:
                  questionLevelData.find(
                    (item) => Number(item?.levelName) === Number(updateValue.questionLevel)
                  ) || {},
                QuestionTrueFalse: String(
                  updateValue?.quizAnswers.some(
                    (answer) =>
                      answer?.content === "Đúng" &&
                      String(answer?.isCorrect) === "true"
                  )
                ),
                shuffle: shuffle.find(
                  (s, index) => updateValue?.isShuffle === s?.valueTitle
                ),
                hint: updateValue?.hint,
              });
            } else if (Number(updateValue?.type) === 2) {
              const typeObject = typeData.find(
                (item) => Number(item?.typeName) === 2
              );

              setInitialValues({
                content: updateValue?.content || "",
                type: typeObject || {},
                questionLevel:
                  questionLevelData.find(
                    (item) => item?.levelName === updateValue.questionLevel
                  ) || {},
                shuffle: shuffle.find(
                  (s, index) => updateValue?.isShuffle === s?.valueTitle
                ),
                hint: updateValue?.hint,
              });

              const mappedFourAnswer = updateValue?.quizAnswers?.map(
                (answer, index) => ({
                  content: answer.content,
                  isCorrect: answer.isCorrect,
                })
              );

              // Set the state with mappedFourAnswer
              setFourAnswer(mappedFourAnswer);
            } else if (Number(updateValue?.type) === 3) {
              const typeObject = typeData.find(
                (item) => Number(item?.typeName) === 3
              );

              setInitialValues({
                content: updateValue?.content || "",
                type: typeObject || {},
                questionLevel:
                  questionLevelData.find(
                    (item) => item?.levelName === updateValue.questionLevel
                  ) || {},
                shuffle: shuffle.find(
                  (s, index) => updateValue?.isShuffle === s?.valueTitle
                ),
                hint: updateValue?.hint,
              });

              const mappedMultipleAnswer = updateValue?.quizAnswers?.map(
                (answer, index) => ({
                  content: answer.content,
                  isCorrect: answer.isCorrect,
                })
              );

              // Set the state with mappedMultipleAnswer
              setMultipleAnswer(mappedMultipleAnswer);
            }
          } catch (e) {
            setLoadingForm(false);
          } finally {
            setLoadingForm(false);
          }
        }
      } catch (e) {
        settypeList([]);
        setquestionLevelList([]);
        setquizListList([]);
      } finally {
        setLoading(false);
      }
    };

    if (visibleUpdate) {
      fetchFormData();
    }
  }, [visibleUpdate, updateValue]);

  const onSubmit = (values) => {
    // console.log('====================================');
    // console.log("checked::",typeQuestion === updateValue);
    // console.log('====================================');
    if (Number(typeQuestion) === 1) {
      if (!values.QuestionTrueFalse) {
        REJECT(toast, "Bạn phải chọn đáp án đúng");
      } else {
        const QuestionTrueFalseValue = values.QuestionTrueFalse === "true";

        // Create a new FormData object
        let formData = new FormData();

        // Append each field to the FormData object
        formData.append("Id", updateValue?.id);
        formData.append("type", values.type.typeName);
        formData.append("content", values?.content);
        formData.append("isActive", true); // Assuming isActive is a boolean
        formData.append("questionLevel", values?.questionLevel?.levelName);
        formData.append("IsShuffle", values?.shuffle?.valueTitle);
        if (values?.quiz && values?.quiz?.id) {
          formData.append("quizId", values?.quiz?.id);
        }
        formData.append("hint", values?.hint);

        [
          { 
            ...(Number(typeQuestion) === Number(updateValue?.type) && { id: updateValue?.quizAnswers[0]?.id }),
            content: "Đúng",
            isCorrect: QuestionTrueFalseValue === true,
          },
          {
            ...(Number(typeQuestion) === Number(updateValue?.type) && { id: updateValue?.quizAnswers[1]?.id }),
            content: "Sai",
            isCorrect: QuestionTrueFalseValue === false,
          },
        ].forEach((obj, index) => {
          Object.entries(obj).forEach(([key, value]) => {
            formData.append(`QuizAnswers[${index}].${key}`, value);
          });
        });

        restClient({
          url: "api/quizquestion/updatequizquestion",
          method: "PUT",
          data: formData,
        })
          .then((res) => {
            SUCCESS(toast, "Cập nhật câu hỏi thành công thành công");
            fetchData();
          })
          .catch((err) => {
            REJECT(toast, err.message);
          })
          .finally(() => {
            setVisibleUpdate(false);
            setLoading(false);
          });
      }
    } else if (Number(typeQuestion) === 2) {
      if (hasEmptyContent(fourAnswer)) {
        REJECT(
          toast,
          "Vui lòng nhập đủ đáp án và không được nhập đáp án là khoảng trắng"
        );
      } else if (!handleMultipleCorrect(fourAnswer)) {
        REJECT(toast, "Vui lòng chọn một đáp án đúng cho câu hỏi");
      } else {
        // Create a new FormData object
        let formData = new FormData();

        // Append each field to the FormData object
        formData.append("Id", updateValue?.id);
        formData.append("type", values.type.typeName);
        formData.append("content", values?.content);
        formData.append("isActive", true); // Assuming isActive is a boolean
        formData.append("questionLevel", values?.questionLevel?.levelName);
        formData.append("IsShuffle", values?.shuffle?.valueTitle);
        if (values?.quiz && values?.quiz?.id) {
          formData.append("quizId", values?.quiz?.id);
        }
        formData.append("hint", values?.hint);

        fourAnswer.forEach((obj, index) => {
          Object.entries(obj).forEach(([key, value]) => {
            if(Number(typeQuestion) === Number(updateValue?.type)){
            formData.append(`QuizAnswers[${index}].id`, updateValue?.quizAnswers[index]?.id);
            }
            formData.append(`QuizAnswers[${index}].${key}`, value);
          });
        });

        restClient({
          url: "api/quizquestion/updatequizquestion",
          method: "PUT",
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
            setVisibleUpdate(false);
            setLoading(false);
          });
      }
    } else if (Number(typeQuestion) === 3) {
      if (handleMultipleContent(multipleAnswer)) {
        REJECT(
          toast,
          "Vui lòng nhập đủ đáp án và không được nhập đáp án là khoảng trắng"
        );
      } else if (handleMultipleCorrect(multipleAnswer)) {
        REJECT(toast, "Vui lòng chọn hai đáp án đúng trở lên cho câu hỏi");
      } else {
        // Create a new FormData object
        let formData = new FormData();

        // Append each field to the FormData object
        formData.append("Id", updateValue?.id);
        formData.append("type", values.type.typeName);
        formData.append("content", values?.content);
        formData.append("isActive", true); // Assuming isActive is a boolean
        formData.append("questionLevel", values?.questionLevel?.levelName);
        formData.append("IsShuffle", values?.shuffle?.valueTitle);
        if (values?.quiz && values?.quiz?.id) {
          formData.append("quizId", values?.quiz?.id);
        }
        formData.append("hint", values?.hint);
        
        multipleAnswer.forEach((obj, index) => {
          Object.entries(obj).forEach(([key, value]) => {
            if(Number(typeQuestion) === Number(updateValue?.type)){
              formData.append(`QuizAnswers[${index}].id`, updateValue?.quizAnswers[index]?.id);
              }
            formData.append(`QuizAnswers[${index}].${key}`, value);
          });
        });

        restClient({
          url: "api/quizquestion/updatequizquestion",
          method: "PUT",
          data: formData,
        })
          .then((res) => {
            SUCCESS(toast, "Cập nhật câu hỏi thành công thành công");
            fetchData();
          })
          .catch((err) => {
            REJECT(toast, err.message);
          })
          .finally(() => {
            setVisibleUpdate(false);
            setLoading(false);
          });
      }
    }
  };

  const handleChangeType = (e, helpers, setTouchedState, props) => {
    setTypeQuestion(e?.value?.typeName); // Update typeQuestion based on selection

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

  //handle four answer
  const handleFourAnswerChange = (e, index) => {
    const { value } = e.target;
    setFourAnswer((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index].content = value;
      return updatedAnswers;
    });
  };

  const handleFourAnswerCorrectChange = (e, index) => {
    const { checked } = e.target;

    setFourAnswer((prevAnswers) => {
      const updatedAnswers = prevAnswers.map((answer, idx) => {
        if (idx === index) {
          return { ...answer, isCorrect: checked };
        } else {
          return { ...answer, isCorrect: false }; // Set other answers to false
        }
      });

      return updatedAnswers;
    });
  };

  //handle multiple answer
  const changeMultipleContent = (e, index) => {
    console.log(multipleAnswer);
    const { value } = e.target;
    setMultipleAnswer((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[index].content = value;
      return updatedAnswers;
    });
  };

  const changeMultipleIsCorrect = (e, index) => {
    const { checked } = e.target;

    setMultipleAnswer((prevAnswers) => {
      return prevAnswers.map((answer, idx) => {
        if (idx === index) {
          return { ...answer, isCorrect: checked };
        } else {
          return answer; // Keep other answers unchanged
        }
      });
    });
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
    // quiz: Yup.object()
    //   .test("is-not-empty", "Không được để trống trường này", (value) => {
    //     return Object.keys(value).length !== 0;
    //   })
    //   .required("Không bỏ trống trường này"),
  });

  const handleNumberAnswer = (e) => {
    const value = parseInt(e?.target?.value);
    console.log(value);

    if (!isNaN(value)) {
      if (value < 6) {
        setNumberAnswerOfMultichoice(6); // Set minimum value to 6
      } else if (value > 10) {
        setNumberAnswerOfMultichoice(10); // Limit maximum value to 10
      } else {
        setNumberAnswerOfMultichoice(value); // Update state with entered value
      }
    } else {
      setNumberAnswerOfMultichoice(6); // Reset to 0 if NaN (e.g., empty input)
    }
  };

  return (
    <Dialog
      header="Cập nhật câu hỏi"
      visible={visibleUpdate}
      style={{ width: "50vw" }}
      onHide={() => {
        if (!visibleUpdate) return;
        setNumberAnswerOfMultichoice(6);
        setMultipleAnswer(
          Array.from({ length: 6 }, (_, index) => ({
            content: "",
            isCorrect: false,
          }))
        );
        setVisibleUpdate(false);
        setFourAnswer([
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
          { content: "", isCorrect: false },
        ]);
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

              {typeQuestion && Number(typeQuestion) === 1 && (
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
                </>
              )}

              {typeQuestion && Number(typeQuestion) === 2 && (
                <>
                  <div className="my-4">
                    <label
                      htmlFor="QuestionFourAnswer"
                      className="block text-md text-gray-700"
                    >
                      Đáp án <span className="text-red-500">*</span>
                    </label>
                    <div className="mt-1">
                      {fourAnswer.map((answer, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 my-2"
                        >
                          <input
                            className="w-full shadow-none p-1 border rounded-md"
                            type="text"
                            placeholder={`Đáp án ${index + 1}`}
                            value={answer?.content}
                            onChange={(e) => handleFourAnswerChange(e, index)}
                          />
                          <input
                            type="radio"
                            className="form-radio text-blue-500"
                            checked={answer?.isCorrect}
                            onChange={(e) =>
                              handleFourAnswerCorrectChange(e, index)
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {typeQuestion && Number(typeQuestion) === 3 && (
                <>
                  
                  {numberAnswerOfMultichoice > 0 && (
                    <div className="my-4">
                      <label
                        htmlFor="QuestionTrueFalse"
                        className="block text-md text-gray-700"
                      >
                        Đáp án <span className="text-red-500">*</span>
                      </label>

                      {multipleAnswer?.map((answer, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-2 my-2"
                        >
                          <input
                            className="w-full shadow-none p-1 border rounded-md"
                            type="text"
                            placeholder={`Đáp án ${index + 1}`}
                            value={answer?.content}
                            onChange={(e) => changeMultipleContent(e, index)}
                          />
                          <input
                            type="checkbox"
                            className="form-radio text-blue-500"
                            checked={answer?.isCorrect}
                            onChange={(e) => changeMultipleIsCorrect(e, index)}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}

              {typeQuestion && (
                <>
                  <CustomDropdownInSearch
                    title="Trộn đáp án"
                    label="Trộn đáp án"
                    name="shuffle"
                    id="shuffle"
                    isClear={false}
                    isTouched={true}
                    handleOnChange={handleChangeShuffle}
                    options={shuffle}
                  />
                  <div>
                    <div>
                      <CustomEditor
                        isTouched={true}
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
                  onClick={() => {
                    setVisibleUpdate(false);
                    setFourAnswer([
                      { content: "", isCorrect: false },
                      { content: "", isCorrect: false },
                      { content: "", isCorrect: false },
                      { content: "", isCorrect: false },
                    ]);
                    setNumberAnswerOfMultichoice(6);
                    setMultipleAnswer(
                      Array.from({ length: 6 }, (_, index) => ({
                        content: "",
                        isCorrect: false,
                      }))
                    );
                    setTypeQuestion("");
                  }}
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
};

export default UpdateQuestion;
