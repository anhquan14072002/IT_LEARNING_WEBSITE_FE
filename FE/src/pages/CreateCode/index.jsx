import React, { useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { Formik, Form, Field, ErrorMessage } from "formik";
import LoadingScreen from "../../components/LoadingScreen";
import { useNavigate, useParams } from "react-router-dom";
import Menu from "../../components/Menu";
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
import AddTestCase from "../../components/AddTestCase";
import { Toast } from "primereact/toast";
import { encodeBase64, REJECT } from "../../utils";

const validationSchema = Yup.object({
  language: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function CreateCode() {
  const [initialValues, setInitialValues] = useState({
    language: {},
  });
  const { id } = useParams();
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const toast = useRef(null);

  const [languagesList, setLanguagesList] = useState([]);

  const [language, setLanguage] = useState("javascript");
  const [codeMain, setCodeMain] = useState("");
  const [library, setLibrary] = useState("");
  const [codeSample, setCodeSample] = useState("");
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
        //fetch languages
        const languagesResponse = await restClient({
          url: `api/programlanguage/getallprogramlanguage`,
          method: "GET",
        });
        const transformedV1 = languagesResponse?.data?.data?.map((item) => ({
          title: item?.name,
          idBase: item?.id,
        }));
        setLanguagesList(transformedV1);
      } catch (error) {
        setLanguagesList([]);
      }
    };

    fetchData();
  }, []);

  const onSubmit = async (values) => {
    setLoading(true);

    // await restClient({
    //   url: "api/programlanguage/createprogramlanguage",
    //   method: "POST",
    //   data: {
    //     name: values?.language?.title,
    //     baseId: values?.language?.idBase,
    //     isActive: true,
    //   },
    // })
    //   .then((res) => {
    //     const programLanguage = res?.data?.data;
    restClient({
      url: "api/executecode/createexecutecode",
      method: "POST",
      data: {
        mainCode: encodeBase64(codeMain),
        sampleCode: encodeBase64(codeSample),
        problemId: id,
        languageId: values?.language?.idBase,
        libraries: library,
      },
    })
      .then((res) => {})
      .catch((err) => {
        REJECT(toast, "Xảy ra lỗi khi thêm mã thực thi");
      }).finally(()=>{
        window.location.href = `/dashboard/quiz/manageexecutecode/${id}`;
      });
    // })
    // .catch((err) => {
    //   REJECT(toast, "Xảy ra lỗi khi thêm mã thực thi");
    // })
    // .finally(() => {
    //   setLoading(false);
    //   window.location.href = `/dashboard/quiz/manageexecutecode/${id}`;
    // });
  };

  return (
    <>
      {loading ? (
        <LoadingScreen setLoading={setLoading} />
      ) : (
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
            <div className="p-3 bg-white rounded-lg mt-5 mb-5">
              <h1 className="font-bold text-3xl my-5 text-center">
                Tạo mã thực thi
              </h1>
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={onSubmit}
              >
                {(formik) => (
                  <Form>
                    <CustomDropdown
                      title="Ngôn ngữ"
                      label="Ngôn ngữ"
                      name="language"
                      id="language"
                      isClear={true}
                      options={languagesList}
                    />

                    <div className="mb-2">
                      <h1>
                        Import thư viện <span className="text-red-600">*</span>
                      </h1>
                      <CodeMirror
                        value={library}
                        options={{
                          mode: language,
                          theme: "material",
                          lineNumbers: true,
                        }}
                        onBeforeChange={(editor, data, value) => {
                          setLibrary(value);
                        }}
                        editorDidMount={(editor) => {
                          editor.setSize(null, "calc(50vh - 5px)");
                        }}
                      />
                    </div>
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
      )}
    </>
  );
}
