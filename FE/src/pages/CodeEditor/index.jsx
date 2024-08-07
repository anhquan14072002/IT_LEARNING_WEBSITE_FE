import React, { useEffect, useRef, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import Header from "../../components/Header";
import Menu from "../../components/Menu";
import Split from "react-split";
import "./index.css";
import DescriptionComponent from "../../components/DescriptionComponent";
import { useParams } from "react-router-dom";
import InstructionComponent from "../../components/InstructionComponent";
import rclsestClient from "../../services/restClient";
import {
  decodeBase64,
  encodeBase64,
  isLoggedIn,
  processInput,
  REJECT,
} from "../../utils";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import restClient from "../../services/restClient";

// Define test cases
const testCases = [
  { input: "[1,2,3,4,5]", expectedOutput: "15" },
  { input: "[10,20,30]", expectedOutput: "60" },
];

const CodeEditor = () => {
  const toast = useRef(null);
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [code, setCode] = useState();
  const [selectedTestCase, setSelectedTestCase] = useState(-1);
  const [navIndex, setNavIndex] = useState(1);
  const { id } = useParams();
  const [executeCode, setExecuteCode] = useState([]);
  const [language, setLanguage] = useState(null);
  const [testcaseList, setTestCaseList] = useState([]);
  const [testCase, setTestCase] = useState();
  const [result, setResult] = useState();
  const user = useSelector((state) => state.user.value);
  const [errorList, setErrorList] = useState([]);
  const [typeError, setErrorType] = useState(null);

  useEffect(() => {
    console.log("testcase::", testCase?.isHidden);
  }, [testCase]);

  const submit = () => {
    if (!isLoggedIn()) {
      REJECT(toast, "Vui lòng đăng nhập");
      return;
    }
    let model = {
      problemId: id,
      languageId: language?.id,
      sourceCode: encodeBase64(code),
      userId: user?.sub,
      submit: true,
    };
    restClient({
      url: "api/submission/submitproblem",
      method: "POST",
      data: model,
    })
      .then((res) => {
        console.log("====================================");
        console.log("response::", res?.data?.data);
        console.log("====================================");
      })
      .catch((err) => {
        console.log("====================================");
        console.log(err?.response?.data?.data);
        console.log("====================================");
      });
  };

  const runTestCases = () => {
    if (!isLoggedIn()) {
      REJECT(toast, "Vui lòng đăng nhập");
      return;
    }

    let model = {
      problemId: id,
      languageId: language?.id,
      sourceCode: encodeBase64(code),
      userId: user?.sub,
      submit: false,
    };
    restClient({
      url: "api/submission/submitproblem",
      method: "POST",
      data: model,
    })
      .then((res) => {
        console.log("====================================");
        console.log("response::", res?.data?.data);
        console.log("====================================");
      })
      .catch((err) => {
        console.log("====================================");
        console.log(err?.response?.data?.data);
        console.log("====================================");
        setErrorType(err?.response?.data?.message);
        if (err?.response?.data?.message) {
        }
      });
  };

  useEffect(() => {
    // Ensure testcaseList is an array
    if (!Array.isArray(testcaseList)) {
      setTestCaseList([]);
    }
  }, [testcaseList]);

  useEffect(() => {
    restClient({ url: "api/executecode/getallexecutecodebyproblemid/" + id })
      .then((res) => {
        setExecuteCode(res.data?.data);
        setCode(decodeBase64(res.data?.data[0]?.sampleCode) || "");
        restClient({
          url:
            "api/programlanguage/getprogramlanguagebyid/" +
            res.data?.data[0]?.languageId,
        })
          .then((res) => {
            setLanguage(res.data?.data);
            restClient({
              url: "api/testcase/getalltestcasebyproblemid/" + id,
            })
              .then((res) => {
                // Log the raw Base64 data
                console.log("Raw test cases:", res.data?.data);

                const decodedTestCases = res.data?.data.map((testCase) => {
                  try {
                    return {
                      ...testCase,
                      input: decodeBase64(testCase.input),
                      output: decodeBase64(testCase.output),
                    };
                  } catch (error) {
                    console.error("Error decoding test case:", testCase, error);
                    return {
                      ...testCase,
                      input: "Invalid input",
                      output: "Invalid output",
                    };
                  }
                });

                setTestCaseList(decodedTestCases);
              })
              .catch((err) => console.error(err));
          })
          .catch((err) => {
            setLanguage(null);
            console.error(err);
          });
      })
      .catch((err) => {
        setExecuteCode([]);
        console.error(err);
      });
  }, [id]);

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 500);
  }, [fixedDivRef.current]);

  const codeMirrorRef = useRef(null);

  return (
    <div>
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
        <Toast ref={toast} />
      </div>
      <div>
        <Split
          sizes={[40, 60]}
          minSize={100}
          expandToMin={false}
          gutterSize={10}
          gutterAlign="center"
          snapOffset={30}
          dragInterval={1}
          direction="horizontal"
          cursor="col-resize"
          className="flex"
          style={{ paddingTop: `${fixedDivHeight}px` }}
        >
          <div className="p-5 h-screen overflow-y-auto custom-scrollbar min-w-[30%]">
            <nav className="flex space-x-4 mb-10">
              <button
                onClick={() => setNavIndex(1)}
                className={`py-2 px-4 rounded-lg ${
                  navIndex === 1
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-blue-600 transition-colors`}
              >
                Chi tiết
              </button>
              <button
                onClick={() => setNavIndex(2)}
                className={`py-2 px-4 rounded-lg ${
                  navIndex === 2
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-gray-700"
                } hover:bg-blue-600 transition-colors`}
              >
                Hướng dẫn
              </button>
            </nav>
            {navIndex === 1 && <DescriptionComponent id={id} />}
            {navIndex === 2 && <InstructionComponent id={id} />}
          </div>

          <div className="min-w-[30%] bg-[#182537]">
            {/* Code Editor */}
            <div
              className="h-screen overflow-y-auto custom-scrollbar"
              style={{ height: "100vh" }}
            >
              <div
                className="h-full"
                style={{ height: "10vh", backgroundColor: "#182537" }}
              >
                <div className="flex justify-between flex-wrap p-2 text-white">
                  <h2 className="font-semibold">Ngôn ngữ : {language?.name}</h2>
                  <div className="flex gap-5 flex-wrap">
                    <button
                      onClick={runTestCases}
                      className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                    >
                      Chạy code
                    </button>
                    <button
                      className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors"
                      onClick={submit}
                    >
                      Nộp bài
                    </button>
                  </div>
                </div>
              </div>
              <Split
                maxSize={700}
                expandToMin={true}
                gutterSize={10}
                gutterAlign="center"
                snapOffset={30}
                dragInterval={1}
                direction="vertical"
                cursor="row-resize"
                onDrag={(e) => {
                  if (codeMirrorRef.current) {
                    codeMirrorRef.current.editor.display.wrapper.style.height = `calc(${e[0]}vh - 5px)`;
                  }
                }}
                className="h-[100vh]"
              >
                <div className="border border-gray-300 rounded-lg shadow-md">
                  <CodeMirror
                    ref={codeMirrorRef}
                    value={code}
                    options={{
                      theme: "material",
                      lineNumbers: true,
                    }}
                    onBeforeChange={(editor, data, value) => {
                      setCode(value);
                    }}
                    editorDidMount={(editor) => {
                      editor.setSize(null, "calc(50vh - 5px)");
                    }}
                  />
                </div>

                <div>
                  Split
                </div>
                
              </Split>
            </div>
          </div>
        </Split>
        {/* Problem Description */}
      </div>
    </div>
  );
};

export default CodeEditor;
