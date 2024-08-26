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
import restClient from "../../services/restClient";
import LoadingFull from "../../components/LoadingFull";
import {
  ACCEPT,
  decodeBase64,
  encodeBase64,
  isLoggedIn,
  processInput,
  REJECT,
} from "../../utils";
import { Toast } from "primereact/toast";
import { useSelector } from "react-redux";
import { Tooltip } from "primereact/tooltip";
import { ProgressSpinner } from "primereact/progressspinner";
import CommentCoding from "../../components/CommentCoding";
import SubmitCoding from "../../components/SubmitCoding";
import NotifyProvider from "../../store/NotificationContext";

const CodeEditor = () => {
  const toast = useRef(null);
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [code, setCode] = useState("");
  const [selectedTestCase, setSelectedTestCase] = useState(-1);
  const [navIndex, setNavIndex] = useState(1);
  const { id } = useParams();
  const [executeCode, setExecuteCode] = useState([]);
  const [language, setLanguage] = useState(null);
  const [testcaseList, setTestCaseList] = useState([]);
  const [testCase, setTestCase] = useState();
  const [result, setResult] = useState([]);
  const [errorResult, setErrorResult] = useState();
  const user = useSelector((state) => state.user.value);
  const [errorList, setErrorList] = useState([]);
  const [typeError, setErrorType] = useState(null);
  const [loading, setLoading] = useState(false); // State to manage loading

  const submit = () => {
    if (!isLoggedIn()) {
      REJECT(toast, "Vui lòng đăng nhập");
      return;
    }
    setLoading(true); // Show loading spinner
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
        ACCEPT(toast, "Nộp bài thành công !!!");
        setErrorResult(res?.data?.message);
        setResult(res?.data?.data);
        setSelectedTestCase(0);
        setErrorResult();
      })
      .catch((err) => {
        if (err?.response?.data?.message === "WrongAnswer") {
          setSelectedTestCase(0);
        } else {
          setSelectedTestCase(-1);
        }
        setErrorResult(err?.response?.data?.message);
        setResult(err?.response?.data?.data);
        REJECT(toast, "Nộp bài không thành công do chưa pass hết testcase !!!");
      })
      .finally(() => setLoading(false)); // Hide loading spinner
  };

  const runTestCases = () => {
    if (!isLoggedIn()) {
      REJECT(toast, "Vui lòng đăng nhập");
      return;
    }
    setLoading(true); // Show loading spinner
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
        setErrorResult(res?.data?.message);
        setResult(res?.data?.data);
        setSelectedTestCase(0);
        setErrorResult();
      })
      .catch((err) => {
        if (err?.response?.data?.message === "WrongAnswer") {
          setSelectedTestCase(0);
        } else {
          setSelectedTestCase(-1);
        }
        setErrorResult(err?.response?.data?.message);
        setResult(err?.response?.data?.data);
      })
      .finally(() => setLoading(false)); // Hide loading spinner
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
          url: `api/submission/getsubmission?ProblemId=${id}&UserId=${localStorage.getItem('userId')}&LanguageId=${res.data?.data[0]?.languageId}`,
        })
          .then((res) => {
            setCode(decodeBase64(res?.data?.data?.sourceCode));
          })
          .catch((err) => {});
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

                setTestCaseList(res.data?.data);
                setSelectedTestCase(0);
                setTestCase(
                  Array.isArray(res.data?.data) ? res.data?.data[0] : []
                );
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

  const handleLanguageChange = (event) => {
    const selectedLanguageId = event.target.value;
    restClient({
      url: `api/submission/getsubmission?ProblemId=${id}&UserId=${localStorage.getItem('userId')}&LanguageId=${selectedLanguageId}`,
    })
      .then((res) => {
        const selectedLanguage = executeCode?.find(
          (language) => language?.id === parseInt(selectedLanguageId)
        );
        console.log("selected language: " + selectedLanguage);

        setLanguage(selectedLanguage);
        if (res?.data?.data?.sourceCode) {
          setCode(decodeBase64(res?.data?.data?.sourceCode));
        } else {
          if (Array.isArray(executeCode)) {
            setCode(decodeBase64(selectedLanguage?.sampleCode));
          } else {
            setCode();
          }
        }
      })
      .catch((err) => {
        restClient({
          url: "api/executecode/getallexecutecodebyproblemid/" + id,
        })
          .then((res) => {
            // setExecuteCode(res.data?.data?.find((item,index)=> item.languageId === selectedLanguageId));
            const codeChange = res.data?.data?.find(
              (item, index) =>
                Number(item?.languageId) === Number(selectedLanguageId)
            );
            setCode(decodeBase64(codeChange?.sampleCode) || "");
            restClient({
              url:
                "api/programlanguage/getprogramlanguagebyid/" +
                selectedLanguageId,
            })
              .then((res) => {
                setLanguage(res?.data?.data);
              })
              .catch((err) => {
                setLanguage(null);
              });
          })
          .catch((err) => {});
      });
  };

  return (
    <NotifyProvider>
      <div>
        <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
          <Header />
          <Toast ref={toast} />
        </div>
        {loading && <LoadingFull />}
        <>
        
        <div className="hidden lg:block">
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
              <nav className="flex flex-wrap justify-center gap-5 space-x-4 mb-10">
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
                <button
                  onClick={() => setNavIndex(3)}
                  className={`py-2 px-4 rounded-lg ${
                    navIndex === 3
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-600 transition-colors`}
                >
                  Bình luận
                </button>
                {isLoggedIn() && (
                  <button
                    onClick={() => setNavIndex(4)}
                    className={`py-2 px-4 rounded-lg ${
                      navIndex === 4
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-600 transition-colors`}
                  >
                    Bài đã nộp
                  </button>
                )}
              </nav>
              {navIndex === 1 && <DescriptionComponent id={id} />}
              {navIndex === 2 && <InstructionComponent id={id} />}
              {navIndex === 3 && <CommentCoding id={id} />}
              {isLoggedIn() && navIndex === 4 && <SubmitCoding id={id} />}
            </div>

            <div className="min-w-[30%] bg-[#182537]">
              {/* Code Editor */}
              <div
                className="h-screen overflow-y-auto custom-scrollbar"
                style={{ height: "100vh" }}
              >
                <div
                  className="h-full"
                  style={{ height: "auto", backgroundColor: "#182537" }}
                >
                  <div className="flex justify-between flex-wrap p-2 text-white gap-2">
                    <div className="flex items-center">
                      <label htmlFor="language-select" className="mr-2">
                        Ngôn ngữ:
                      </label>
                      <select
                        id="language-select"
                        value={language?.id || ""}
                        onChange={handleLanguageChange}
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-700 focus:outline-none"
                      >
                        <option value="" disabled>
                          Chọn ngôn ngữ
                        </option>
                        {executeCode?.map((lang) => (
                          <option key={lang?.id} value={lang?.languageId}>
                            {lang?.languageName}
                          </option>
                        ))}
                      </select>
                    </div>
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

                  <div
                    style={{ backgroundColor: "#182537", height: "auto" }}
                    className="p-2 flex"
                  >
                    {/* Test Case Navigation Bar */}
                    <nav className="flex flex-col gap-2 w-1/6">
                      {errorResult !== "WrongAnswer" &&
                        errorResult !== "Accepted" &&
                        errorResult && (
                          <button
                            onClick={() => setSelectedTestCase(-1)}
                            className={`py-2 px-4 rounded-lg ${
                              selectedTestCase === -1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            } hover:bg-blue-600 transition-colors`}
                          >
                            Console
                          </button>
                        )}
                      {testcaseList?.map((item, index) => (
                        <button
                          key={item.id} // Use a unique key if available
                          onClick={() => {
                            setSelectedTestCase(index);
                            setTestCase(item);
                          }}
                          className={`py-2 px-4 rounded-lg ${
                            selectedTestCase === index
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-blue-600 transition-colors`}
                        >
                          {Array?.isArray(result) &&
                            result[index] &&
                            result[index]?.status === "Accepted" && (
                              <>
                                <span
                                  className="pi pi-check-circle text-green-600 font-bold text-xl mr-1"
                                  data-pr-tooltip="Test case đã pass"
                                  data-pr-position="top"
                                ></span>
                                <Tooltip target=".pi-check-circle" />
                              </>
                            )}
                          {Array?.isArray(result) &&
                            result[index] &&
                            result[index]?.status === "WrongAnswer" && (
                              <>
                                <span
                                  className="pi pi-times-circle text-red-600 font-bold text-xl mr-1"
                                  data-pr-tooltip="Test case chưa pass"
                                  data-pr-position="top"
                                ></span>
                                <Tooltip target=".pi-times-circle" />
                              </>
                            )}
                          Test Case {index + 1}
                          {/* Dynamically label the buttons */}
                        </button>
                      ))}

                      
                    </nav>

                    {selectedTestCase === -1 && (
                      <div className="h-auto p-3 bg-transparent text-red-500 font-semibold text-base ml-5 w-5/6 overflow-x-auto">
                        {errorResult}
                        <br />
                        {/* {Array.isArray(result) && result[0]?.compileOutput &&
                          decodeBase64(result[0]?.compileOutput)}
                          {Array.isArray(result) && result[0]?.standardError &&
                          decodeBase64(result[0]?.standardError)}
                          {Array.isArray(result) && result[0]?.message &&
                          decodeBase64(result[0]?.message)} */}


                        {result?.map((item, index) => {
                          const status = item?.status;

                          // Check if status is not "Accepted" or "WrongAnswer"
                          if (
                            status !== "Accepted" &&
                            status !== "WrongAnswer"
                          ) {
                            return (
                              <div key={index} className="result-container flex">
                               <div>
                               {item?.compileOutput && (
                                  <div>
                                    <pre>
                                      {decodeBase64(item?.compileOutput)}
                                    </pre>
                                  </div>
                                )}
                               </div>
                              </div>
                            );
                          }

                          return null; // Return null if status is "Accepted" or "WrongAnswer"
                        })}
                      </div>
                    )}

                    {selectedTestCase >= 0 && (
                      <div
                        style={{ backgroundColor: "#182537", height: "auto" }}
                        className="p-2"
                      >
                        {testCase?.isHidden === true ? (
                          <p className="ml-5 text-base text-white font-semibold">
                            Testcase ẩn
                          </p>
                        ) : (
                          <div className="text-white font-semibold text-base ml-5">
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Đầu vào</p>
                              <p>{testCase?.inputView}</p>
                            </div>
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Đầu ra thực tế</p>
                              <p>
                                {Array?.isArray(result) &&
                                  result[selectedTestCase]?.output &&
                                  decodeBase64(
                                    result[selectedTestCase]?.output
                                  )}
                              </p>
                            </div>
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Đầu ra mong đợi</p>
                              <p>{testCase?.output}</p>
                            </div>
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Mô tả</p>
                              <p>
                                {Array?.isArray(result) &&
                                  result[selectedTestCase]?.output &&
                                  result[selectedTestCase]?.status}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Split>
              </div>
            </div>
          </Split>
          {/* Problem Description */}
          
        </div>

        <div className="block lg:hidden">
         
            <div className="px-5 pb-5 h-screen overflow-y-auto custom-scrollbar min-w-[30%]" style={{ paddingTop: `${fixedDivHeight+10}px` }}>
              <nav className="flex flex-wrap justify-center gap-5 space-x-4 mb-10">
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
                <button
                  onClick={() => setNavIndex(3)}
                  className={`py-2 px-4 rounded-lg ${
                    navIndex === 3
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-blue-600 transition-colors`}
                >
                  Bình luận
                </button>
                {isLoggedIn() && (
                  <button
                    onClick={() => setNavIndex(4)}
                    className={`py-2 px-4 rounded-lg ${
                      navIndex === 4
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-blue-600 transition-colors`}
                  >
                    Bài đã nộp
                  </button>
                )}
              </nav>
              {navIndex === 1 && <DescriptionComponent id={id} />}
              {navIndex === 2 && <InstructionComponent id={id} />}
              {navIndex === 3 && <CommentCoding id={id} />}
              {isLoggedIn() && navIndex === 4 && <SubmitCoding id={id} />}
            </div>

            <div className="min-w-[30%] bg-[#182537]">
              <div
                className="h-screen overflow-y-auto custom-scrollbar"
                style={{ height: "100vh" }}
              >
                <div
                  className="h-full"
                  style={{ height: "auto", backgroundColor: "#182537" }}
                >
                  <div className="flex justify-between flex-wrap p-2 text-white gap-2">
                    <div className="flex items-center">
                      <label htmlFor="language-select" className="mr-2">
                        Ngôn ngữ:
                      </label>
                      <select
                        id="language-select"
                        value={language?.id || ""}
                        onChange={handleLanguageChange}
                        className="bg-gray-700 text-white py-2 px-4 rounded-lg border border-gray-600 hover:bg-gray-700 focus:outline-none"
                      >
                        <option value="" disabled>
                          Chọn ngôn ngữ
                        </option>
                        {executeCode?.map((lang) => (
                          <option key={lang?.id} value={lang?.languageId}>
                            {lang?.languageName}
                          </option>
                        ))}
                      </select>
                    </div>
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

                  <div
                    style={{ backgroundColor: "#182537", height: "auto" }}
                    className="p-2 flex"
                  >
                    <nav className="flex flex-col gap-2 w-1/6">
                      {errorResult !== "WrongAnswer" &&
                        errorResult !== "Accepted" &&
                        errorResult && (
                          <button
                            onClick={() => setSelectedTestCase(-1)}
                            className={`py-2 px-4 rounded-lg ${
                              selectedTestCase === -1
                                ? "bg-blue-500 text-white"
                                : "bg-gray-200 text-gray-700"
                            } hover:bg-blue-600 transition-colors`}
                          >
                            Console
                          </button>
                        )}
                      {testcaseList?.map((item, index) => (
                        <button
                          key={item.id} // Use a unique key if available
                          onClick={() => {
                            setSelectedTestCase(index);
                            setTestCase(item);
                          }}
                          className={`py-2 px-4 rounded-lg ${
                            selectedTestCase === index
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700"
                          } hover:bg-blue-600 transition-colors`}
                        >
                          {Array?.isArray(result) &&
                            result[index] &&
                            result[index]?.status === "Accepted" && (
                              <>
                                <span
                                  className="pi pi-check-circle text-green-600 font-bold text-xl mr-1"
                                  data-pr-tooltip="Test case đã pass"
                                  data-pr-position="top"
                                ></span>
                                <Tooltip target=".pi-check-circle" />
                              </>
                            )}
                          {Array?.isArray(result) &&
                            result[index] &&
                            result[index]?.status === "WrongAnswer" && (
                              <>
                                <span
                                  className="pi pi-times-circle text-red-600 font-bold text-xl mr-1"
                                  data-pr-tooltip="Test case chưa pass"
                                  data-pr-position="top"
                                ></span>
                                <Tooltip target=".pi-times-circle" />
                              </>
                            )}
                          Test Case {index + 1}
                          {/* Dynamically label the buttons */}
                        </button>
                      ))}

                      
                    </nav>

                    {selectedTestCase === -1 && (
                      <div className="h-auto p-3 bg-transparent text-red-500 font-semibold text-base ml-5 w-5/6 overflow-x-auto">
                        {errorResult}
                        <br />
                        
                        {result?.map((item, index) => {
                          const status = item?.status;

                          if (
                            status !== "Accepted" &&
                            status !== "WrongAnswer"
                          ) {
                            return (
                              <div key={index} className="result-container flex">
                               <div>
                               {item?.compileOutput && (
                                  <div>
                                    <pre>
                                      {decodeBase64(item?.compileOutput)}
                                    </pre>
                                  </div>
                                )}
                               </div>
                              </div>
                            );
                          }

                          return null; 
                        })}
                      </div>
                    )}

                    {selectedTestCase >= 0 && (
                      <div
                        style={{ backgroundColor: "#182537", height: "auto" }}
                        className="p-2"
                      >
                        {testCase?.isHidden === true ? (
                          <p className="ml-5 text-base text-white font-semibold">
                            Testcase ẩn
                          </p>
                        ) : (
                          <div className="text-white font-semibold text-base ml-5">
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Đầu vào</p>
                              <p>{testCase?.inputView}</p>
                            </div>
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Đầu ra thực tế</p>
                              <p>
                                {Array?.isArray(result) &&
                                  result[selectedTestCase]?.output &&
                                  decodeBase64(
                                    result[selectedTestCase]?.output
                                  )}
                              </p>
                            </div>
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Đầu ra mong đợi</p>
                              <p>{testCase?.output}</p>
                            </div>
                            <div className="flex gap-5 mb-5">
                              <p className="w-40">Mô tả</p>
                              <p>
                                {Array?.isArray(result) &&
                                  result[selectedTestCase]?.output &&
                                  result[selectedTestCase]?.status}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </Split>
              </div>
            </div>
          
        </div>

        </>
            
      </div>
    </NotifyProvider>
  );
};

export default CodeEditor;
