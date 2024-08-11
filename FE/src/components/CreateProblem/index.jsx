import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LoadingScreen from "../../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import Menu from "../Menu";
import * as Yup from "yup";
import CustomTextInput from "../../shared/CustomTextInput";
import { Button } from "primereact/button";
import CustomDropdown from "../../shared/CustomDropdown";
import CustomDropdownInSearch from "../../shared/CustomDropdownInSearch";
import restClient from "../../services/restClient";
import CustomEditor from "../../shared/CustomEditor";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import restClientV2 from "../../services/restClientV2";
import AddTestCase from "../AddTestCase";
import { Toast } from "primereact/toast";
import { encodeBase64, REJECT } from "../../utils";
import NotifyProvider from "../../store/NotificationContext";

const validationSchema = Yup.object({
  titleInstruction: Yup.string().required(
    "Tiêu đề hướng dẫn không được bỏ trống"
  ),
  descriptionInstruction: Yup.string().required(
    "Trường này không được bỏ trống"
  ),
  grade: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  document: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  title: Yup.string().required("Tiêu đề không được bỏ trống"),
  description: Yup.string().required("Mô tả không được bỏ trống"),
  difficulty: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  topic: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
  lesson: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function CreateProblem() {
  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    difficulty: {},
    topic: {},
    lesson: {},
    grade: {},
    document: {},
    titleInstruction: "",
    descriptionInstruction: "",
  });
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const [gradeList, setListGrade] = useState([]);
  const [difficultyList, setDifficultyList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [topicList, setListTopic] = useState([]);
  const [clearTopic, setClearTopic] = useState(false);
  const [clearGrade, setClearGrade] = useState(false);
  const [clearLesson, setClearLesson] = useState(false);
  const [lessonList, setLessonList] = useState([]);
  const [testCase, setTestCaseList] = useState([]);

  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 1000);
  }, [fixedDivRef.current]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch all grades
        const gradeResponse = await restClient({
          url: `api/grade/getallgrade?isInclude=false`,
          method: "GET",
        });
        setListGrade(gradeResponse?.data?.data || []);

        // Fetch all grades
        const difficultResponse = await restClient({
          url: `api/enum/getalltypedifficulty`,
          method: "GET",
        });
        const transformedData = difficultResponse?.data?.data?.map((item) => ({
          title: item?.name,
          id: item?.value,
        }));
        setDifficultyList(transformedData);
      } catch (error) {
        setListGrade([]);
        setDifficultyList([]);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values) => {
    if (!testCase || testCase.length === 0) {
      REJECT(toast, "Vui lòng tạo test case");
      return;
    }

    setLoading(true);
    await restClient({
      url: "api/problem/createproblem",
      method: "POST",
      data: {
        title: values?.title,
        description: values?.description,
        difficulty: values?.difficulty?.id,
        isActive: true,
        topicId: values?.topic?.id,
        lessonId: values?.lesson?.id,
      },
    })
      .then((res) => {
        const problemData = res?.data?.data;
        console.log("====================================");
        console.log(res.data?.data);
        console.log("====================================");

        const programLanguage = res?.data?.data;

        const formData = new FormData();
        formData.append("Title", values?.titleInstruction);
        formData.append("Description", values?.descriptionInstruction);
        formData.append("ProblemId", problemData?.id);
        restClient({
          url: "api/editorial/createeditorial",
          method: "POST",
          data: formData,
        })
          .then((res) => {
            testCase.forEach((item, index) => {
              restClient({
                url: "api/testcase/createtestcase",
                method: "POST",
                data: {
                  input:
                    item?.input === null ? null : encodeBase64(item?.input),
                  output: encodeBase64(item?.output),
                  isHidden: item?.visible,
                  isActive: true,
                  problemId: problemData?.id,
                },
              });
            });
          })
          .catch((err) => {
            REJECT(toast, "Xảy ra lỗi khi thêm bài tập");
          });
      })
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi thêm bài tập");
        setLoading(false);
      })
      .finally(() => {
        navigate("/dashboard/codeeditor");
      });
  };

  const handleOnChangeGrade = (e, helpers, setTouchedState, props) => {
    setClearGrade(true);
    setClearTopic(true);
    setClearLesson(true);
    setDocumentList([]);
    setListTopic([]);
    setLessonList([]);
    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }
    restClient({
      url: `api/document/getalldocumentbygrade/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setDocumentList(res.data.data || []);
      })
      .catch((err) => {
        setDocumentList([]);
      });
  };

  const handleOnChangeDocument = (e, helpers, setTouchedState, props) => {
    setClearTopic(true);
    setClearLesson(true);
    setListTopic([]);
    setLessonList([]);
    if (!e.target.value || !e.target.value.id) {
      setListTopic([]);
      helpers.setValue({});
      setTouchedState(true); // Set touched state to true when onChange is triggered
      if (props.onChange) {
        props.onChange(e); // Propagate the onChange event if provided
      }
      return; // Exit early if e.target.value or e.target.value.id is undefined
    }

    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }

    restClient({
      url: `api/topic/getalltopicbydocument/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setListTopic(res.data.data || []);
      })
      .catch((err) => {
        setListTopic([]);
      });
  };

  const handleOnChangeTopic = (e, helpers, setTouchedState, props) => {
    setClearLesson(true);
    setLessonList([]);
    if (!e.target.value || !e.target.value.id) {
      setLessonList([]);
      helpers.setValue({});
      setTouchedState(true); // Set touched state to true when onChange is triggered
      if (props.onChange) {
        props.onChange(e); // Propagate the onChange event if provided
      }
      return; // Exit early if e.target.value or e.target.value.id is undefined
    }

    helpers.setValue(e.value);
    setTouchedState(true); // Set touched state to true when onChange is triggered
    if (props.onChange) {
      props.onChange(e); // Propagate the onChange event if provided
    }

    restClient({
      url: `api/lesson/getalllessonbytopic/` + e.target.value.id,
      method: "GET",
    })
      .then((res) => {
        setLessonList(res.data.data || []);
      })
      .catch((err) => {
        setLessonList([]);
      });
  };

  const handleOpenModal = () => {
    setVisible(true);
  };

  const handleDeleteTestCase = (index) => {
    setTestCaseList((prevTestCase) =>
      prevTestCase.filter((_, i) => i !== index)
    );
  };

  useEffect(() => {
    console.log("====================================");
    console.log(testCase);
    console.log("====================================");
  }, [testCase]);

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
        <NotifyProvider>
          <div>
            <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
              <Header />
              <Menu />
            </div>

            <div
              className="px-20 min-h-screen bg-gray-200 pb-5"
              style={{ paddingTop: `${fixedDivHeight}px` }}
            >
              <Toast ref={toast} />
              <AddTestCase
                visible={visible}
                setVisible={setVisible}
                toast={toast}
                testCase={testCase}
                setTestCaseList={setTestCaseList}
              />
              <div className="p-3 bg-white rounded-lg mt-5 mb-5">
                <h1 className="font-bold text-3xl my-5 text-center">
                  Tạo bài tập thực hành
                </h1>
                <Formik
                  initialValues={initialValues}
                  validationSchema={validationSchema}
                  onSubmit={onSubmit}
                >
                  {(formik) => (
                    <Form>
                      <CustomDropdownInSearch
                        title="Chọn lớp"
                        label="Lớp"
                        name="grade"
                        id="grade"
                        isClear={true}
                        handleOnChange={handleOnChangeGrade}
                        options={gradeList}
                      />

                      <CustomDropdownInSearch
                        title="Chọn tài liệu"
                        label="Tài liệu"
                        name="document"
                        id="document"
                        isClear={true}
                        clearGrade={clearGrade}
                        setClearGrade={setClearGrade}
                        disabled={!documentList || documentList.length === 0} // Disable if documentList is empty or undefined
                        handleOnChange={handleOnChangeDocument}
                        options={documentList}
                      />

                      <CustomDropdownInSearch
                        title="Chọn chủ đề"
                        label="Chủ đề"
                        name="topic"
                        id="topic"
                        isClear={true}
                        touched={false}
                        clearGrade={clearTopic}
                        setClearGrade={setClearTopic}
                        disabled={!topicList || topicList.length === 0}
                        handleOnChange={handleOnChangeTopic}
                        options={topicList}
                      />

                      <CustomDropdown
                        title="Chọn bài học"
                        label="Bài học"
                        name="lesson"
                        id="lesson"
                        touched={false}
                        clearTopic={clearLesson}
                        setClearTopic={setClearLesson}
                        disabled={!lessonList || lessonList.length === 0}
                        options={lessonList}
                      />

                      <CustomDropdown
                        title="Độ khó"
                        label="Độ khó"
                        name="difficulty"
                        id="difficulty"
                        isClear={true}
                        options={difficultyList}
                      />

                      <CustomTextInput
                        label="Tiêu đề"
                        name="title"
                        type="text"
                        id="title"
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

                      {/* <CustomDropdown
                      title="Ngôn ngữ"
                      label="Ngôn ngữ"
                      name="language"
                      id="language"
                      isClear={true}
                      options={languagesList}
                    />

                    <div className="mb-2">
                      <h1>
                        Main code <span className="text-red-600">*</span>
                      </h1>
                      <CodeMirror
                        value={codeMain}
                        options={{
                          mode: language,
                          theme: "material",
                          lineNumbers: true,
                        }}
                        onBeforeChange={(editor, data, value) => {
                          setCodeMain(value);
                        }}
                        editorDidMount={(editor) => {
                          editor.setSize(null, "calc(50vh - 5px)");
                        }}
                      />
                    </div>

                    <div className="mb-2">
                      <h1>
                        Sample code <span className="text-red-600">*</span>
                      </h1>
                      <CodeMirror
                        value={codeSample}
                        options={{
                          mode: language,
                          theme: "material",
                          lineNumbers: true,
                        }}
                        onBeforeChange={(editor, data, value) => {
                          setCodeSample(value);
                        }}
                        editorDidMount={(editor) => {
                          editor.setSize(null, "calc(50vh - 5px)");
                        }}
                      />
                    </div> */}

                      <div>
                        <h1>
                          Test case <span className="text-red-600">*</span>
                        </h1>

                        <Button
                          icon="pi pi-plus"
                          className="p-2 bg-green-500 text-white"
                          type="button"
                          severity="success"
                          disabled={testCase?.length > 9}
                          onClick={handleOpenModal}
                        >
                          Tạo test case
                        </Button>
                      </div>
                      {/* Display the test cases */}
                      <div className="my-4">
                        {testCase.length > 0 ? (
                          <ul className="list-disc pl-5 flex gap-5">
                            {testCase.map((test, index) => (
                              <li
                                key={index}
                                className="flex justify-between p-2 items-center mb-2 rounded-lg border border-gray-400"
                              >
                                <span>Test case {index}</span>
                                <Button
                                  icon="pi pi-trash"
                                  type="button"
                                  className="p-button-rounded p-button-danger cursor-pointer"
                                  onClick={() => handleDeleteTestCase(index)}
                                />
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p>Chưa có test case nào</p>
                        )}
                      </div>

                      <CustomTextInput
                        label="Tiêu đề hướng dẫn"
                        name="titleInstruction"
                        type="text"
                        id="titleInstruction"
                      />

                      <div>
                        <CustomEditor
                          label="Thông tin hướng dẫn chi tiết"
                          name="descriptionInstruction"
                          id="descriptionInstruction"
                        >
                          <ErrorMessage
                            name="descriptionInstruction"
                            component="div"
                          />
                        </CustomEditor>
                      </div>

                      <div className="flex justify-end gap-2">
                        {/* <Button
                        className="p-2 bg-red-500 text-white"
                        type="button"
                        severity="danger"
                      >
                        Hủy
                      </Button> */}
                        <Button
                          className="p-2 bg-blue-500 text-white"
                          type="submit"
                        >
                          Thêm
                        </Button>
                      </div>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>

            <Footer />
          </div>
        </NotifyProvider>
      )}
    </>
  );
}
