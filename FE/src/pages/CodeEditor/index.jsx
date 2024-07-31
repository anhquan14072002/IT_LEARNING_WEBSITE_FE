import React, { useEffect, useRef, useState } from "react";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import Header from "../../components/Header";
import Menu from "../../components/Menu";

// Define test cases
const testCases = [
  { input: "[1,2,3,4,5]", expectedOutput: "15" },
  { input: "[10,20,30]", expectedOutput: "60" },
];

const CodeEditor = () => {
  const fixedDivRef = useRef(null);
  const [fixedDivHeight, setFixedDivHeight] = useState(0);
  const [code, setCode] = useState("// Your code here\n");
  const [results, setResults] = useState([]);
  const [language, setLanguage] = useState("javascript"); // State for language
  const [selectedTestCase, setSelectedTestCase] = useState(0); // State for selected test case

  const runTestCases = () => {
    // Simulate running test cases
    const simulatedResults = testCases.map(
      ({ input, expectedOutput }, index) => ({
        testCase: index + 1,
        input,
        expectedOutput,
        result: `Result for Test Case ${index + 1}: Passed (Simulated)`,
      })
    );

    setResults(simulatedResults);
    setSelectedTestCase(1); // Automatically select the first test case
  };

  // Function to handle language change
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };

  useEffect(() => {
    setTimeout(() => {
      if (fixedDivRef.current) {
        setFixedDivHeight(fixedDivRef.current.offsetHeight);
      }
    }, 500);
  }, [fixedDivRef.current]);

  return (
    <div>
      <div ref={fixedDivRef} className="fixed top-0 w-full z-10">
        <Header />
      </div>
      <div className="flex" style={{ paddingTop: `${fixedDivHeight}px` }}>
        {/* Problem Description */}
        <div
          className="p-5 h-screen overflow-y-auto custom-scrollbar"
          style={{ width: "40vw" }}
        >
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
          <h1 className="text-4xl font-extrabold mb-4">Problem Title</h1>
          <p className="text-lg mb-4">
            <strong>Description:</strong> Write a function that...
          </p>
          <p className="text-lg mb-4">
            <strong>Constraints:</strong> ...
          </p>
          <p className="text-lg mb-4">
            <strong>Example:</strong> ...
          </p>
        </div>

        <div>
          {/* Code Editor */}
          <div className="h-screen overflow-y-auto custom-scrollbar"
           style={{ width: "60vw", height: "100vh" }}
          >
            <div
              className="h-full"
              style={{ height: "10vh", backgroundColor: "#182537" }}
            >
              <div className="flex justify-between flex-wrap p-2 text-white">
                <h2 className="font-semibold">Ngôn ngữ : java</h2>
                <div className="flex gap-5 flex-wrap">
                  <button
                    onClick={runTestCases}
                    className="bg-blue-500 text-white py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    Chạy code
                  </button>
                  <button className="bg-green-500 text-white py-2 px-6 rounded-lg hover:bg-green-600 transition-colors">
                    Nộp bài
                  </button>
                </div>
              </div>
            </div>

            <div
              className="border border-gray-300 rounded-lg shadow-md"
              style={{ width: "100%" }}
            >
              <CodeMirror
                value={code}
                options={{
                  mode: language,
                  theme: "material",
                  lineNumbers: true,
                }}
                onBeforeChange={(editor, data, value) => {
                  setCode(value);
                }}
                // Custom height can be set in the `options` or inline style if necessary
                editorDidMount={(editor) => {
                  editor.setSize(null, "60vh"); // Sets the height of the CodeMirror editor
                }}
              />
            </div>
            {/* Resizable Test Case Results Panel */}
            {results.length > 0 && (
              <div
                style={{ backgroundColor: "#182537", height: "30vh" }}
                className="p-2"
              >
                {/* Test Case Navigation Bar */}
                <div>
                  <nav className="flex space-x-4 mb-1">
                    <button
                      key={0}
                      onClick={() => setSelectedTestCase(0)}
                      className={`py-2 px-4 rounded-lg ${
                        selectedTestCase === 0
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      } hover:bg-blue-600 transition-colors`}
                    >
                      Output
                    </button>
                    {results.map(({ testCase }) => (
                      <button
                        key={testCase}
                        onClick={() => setSelectedTestCase(testCase)}
                        className={`py-2 px-4 rounded-lg ${
                          selectedTestCase === testCase
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-gray-700"
                        } hover:bg-blue-600 transition-colors`}
                      >
                        Test Case {testCase}
                      </button>
                    ))}
                  </nav>
                </div>

                {selectedTestCase === 0 && (
                  <div className="border h-auto p-3 bg-white">ket qua la A</div>
                )}

                {selectedTestCase > 0 && (
                  <>
                    <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-md p-5">
                      <thead className="bg-gray-100 border-b">
                        <tr>
                          <th className="py-3 px-4 text-left">Input</th>
                          <th className="py-3 px-4 text-left">
                            Expected Output
                          </th>
                          <th className="py-3 px-4 text-left">Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results
                          .filter(
                            ({ testCase }) => testCase === selectedTestCase
                          )
                          .map(
                            ({ testCase, input, expectedOutput, result }) => (
                              <tr key={testCase} className="border-b">
                                <td className="py-3 px-4">{input}</td>
                                <td className="py-3 px-4">{expectedOutput}</td>
                                <td className="py-3 px-4">{result}</td>
                              </tr>
                            )
                          )}
                      </tbody>
                    </table>
                  </>
                )}
              </div>
            )}
            {selectedTestCase === 0 && (
              <div
                style={{ backgroundColor: "#182537", height: "30vh" }}
                className="p-2"
              >
                {/* Test Case Navigation Bar */}
                <div>
                  <nav className="flex space-x-4 mb-1">
                    <button
                      key={0}
                      onClick={() => setSelectedTestCase(0)}
                      className={`py-2 px-4 rounded-lg ${
                        selectedTestCase === 0
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      } hover:bg-blue-600 transition-colors`}
                    >
                      Output
                    </button>
                  </nav>
                </div>

                {selectedTestCase === 0 && (
                  <div className="border h-auto p-3 bg-white">ket qua la A</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;

{
  /* Language Selector
      <div className="mb-8">
        <h2 className="text-3xl font-semibold mb-4">Select Language</h2>
        <select
          value={language}
          onChange={handleLanguageChange}
          className="bg-white border border-gray-300 rounded-lg shadow-md py-2 px-4"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
        </select>
      </div> */
}
