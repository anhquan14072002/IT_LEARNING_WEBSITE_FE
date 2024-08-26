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
import restClient from "../../services/restClient";
import { Toast } from "primereact/toast";
import {
  decodeBase64,
  encodeBase64,
  getTokenFromLocalStorage,
  REJECT,
} from "../../utils";
import NotifyProvider from "../../store/NotificationContext";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

const validationSchema = Yup.object({
  language: Yup.object()
    .test("is-not-empty", "Không được để trống trường này", (value) => {
      return Object.keys(value).length !== 0; // Check if object is not empty
    })
    .required("Không bỏ trống trường này"),
});

export default function UpdateExecuteCode() {
  const [initialValues, setInitialValues] = useState({
    language: {}, // Ensure this matches your form structure
  });
  const { id } = useParams();
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadingForm, setLoadingForm] = useState(true); // Start as true to show loading until data is fetched
  const toast = useRef(null);

  const [languagesList, setLanguagesList] = useState([]);
  const [item, setItem] = useState();
  const [language, setLanguage] = useState("javascript");
  const [codeMain, setCodeMain] = useState("");
  const [library, setLibrary] = useState("");
  const [codeSample, setCodeSample] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 1000);
  }, [fixedDivRef.current]);

  useEffect(() => {
    setLoadingForm(true);
    restClient({ url: "api/executecode/getexecutecodebyid/" + id })
      .then((res) => {
        setLibrary(decodeBase64(res?.data?.data?.libraries));
        setCodeMain(decodeBase64(res?.data?.data?.mainCode));
        setItem(res?.data?.data);
        setCodeSample(decodeBase64(res?.data?.data?.sampleCode));
        return restClient({
          url:
            "api/programlanguage/getprogramlanguagebyid/" +
            res?.data?.data?.languageId,
        });
      })
      .then((res) => {
        setInitialValues({
          language: {
            title: res?.data?.data?.name,
            idBase: res?.data?.data?.id,
          },
        });
      })
      .catch((err) => {
        // Handle error
        console.error("Error fetching data:", err);
      })
      .finally(() => {
        setLoadingForm(false);
      });
  }, [id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch languages
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
    if (!codeSample || codeSample.trim() === "") {
      REJECT(toast, "Vui lòng nhập sample code");
      return;
    }

    restClient({
      url: "api/executecode/updateexecutecode",
      method: "PUT",
      data: {
        id,
        mainCode: encodeBase64(codeMain),
        sampleCode: encodeBase64(codeSample),
        problemId: item?.problemId,
        languageId: values?.language?.idBase,
        libraries: encodeBase64(library),
      },
    })
      .then((res) => {
        window.location.href = `/dashboard/quiz/manageexecutecode/${item?.problemId}`;
      })
      .catch((err) => {
        let errorMessage =
          err.response?.data?.message || "Xảy ra lỗi khi thêm mã thực thi";

        if (
          errorMessage &&
          typeof errorMessage === "string" &&
          errorMessage === "ExecuteCode is duplicate !!!"
        ) {
          errorMessage = "Ngôn ngữ bạn muốn tạo đã tồn tại";
        }

        REJECT(toast, errorMessage);
      })
      .finally(() => {});
  };

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
              <div className="p-3 bg-white rounded-lg mt-5 mb-5">
                <h1 className="font-bold text-3xl my-5 text-center">
                  Cập nhật mã thực thi
                </h1>
                {!loadingForm ? (
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
                            Import thư viện{" "}
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
                            Main code 
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
                          <Button
                            className="p-2 bg-blue-500 text-white"
                            type="submit"
                          >
                            Cập nhật
                          </Button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                ) : (
                  <LoadingScreen setLoading={setLoadingForm} />
                )}
              </div>
            </div>

            <Footer />
          </div>
        </NotifyProvider>
      )}
    </>
  );
}
