import React, { useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { REJECT } from "../../utils";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";

const AddTestCase = ({
  visible,
  setVisible,
  testCase,
  setTestCaseList,
  toast,
}) => {
  const [inputView, setInputView] = useState(null);
  const [inputCode, setInputCode] = useState(null);
  const [values, setValues] = useState([""]);
  const [target, setTarget] = useState("");
  const [output, setOutput] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Handle the change in each input value
  const handleInputChange = (e) => {
    setInputView(e.target.value);
  };

  const handleInputCode = (e) => {
    setInputCode(e.target.value);
  };

  const handleAddTestCase = () => {
    // Validate input
    if (!output) {
      REJECT(
        toast,
        "Vui lòng không để trống các trường đánh dấu bắt buộc nhập"
      );
      return; // Exit function if validation fails
    }

    let input;

    console.log("====================================");
    console.log(output);
    console.log("====================================");
    setTestCaseList([
      ...testCase,
      { input: inputCode, inputView, output, visible: isVisible },
    ]);
    setVisible(false);
    setInputCode("");
    setInputView("");
    setOutput("");
  };

  return (
    <Dialog
      header="Thêm test case"
      visible={visible}
      style={{ width: "50vw" }}
      onHide={() => {
        setVisible(false);
        setTotal(0);
        setValues([""]);
        setTarget("");
        setOutput("");
      }}
    >
      <h1 className="font-bold text-center text-lg">Đầu vào</h1>
      <div className="mb-5">
        <h1>Input hiển thị</h1>
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded-lg"
          value={inputView}
          onChange={handleInputChange}
        />
      </div>
      <div className="mb-5">
        <h1>Input truyền vào</h1>
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded-lg"
          value={inputCode}
          onChange={handleInputCode}
        />
      </div>

      <h1 className="font-bold text-center text-lg">Đầu ra</h1>
      <div className="mb-5">
        <h1>
          Kết quả <span className="text-red-500">*</span>
        </h1>
        <CodeMirror
          value={output}
          options={{
            theme: "material",
            lineNumbers: true,
          }}
          onBeforeChange={(editor, data, value) => {
            setOutput(value);
          }}
          editorDidMount={(editor) => {
            editor.setSize(null, "calc(50vh - 5px)");
          }}
        />
      </div>

      <div className="mb-5">
        <h1>
          Hiển thị <span className="text-red-500">*</span>
        </h1>
        <input
          type="checkbox"
          checked={isVisible}
          onChange={() => {
            setIsVisible(!isVisible);
          }}
        />
        <label className="ml-2">Test case này có ẩn không?</label>
      </div>

      <div className="flex justify-end gap-5">
        <Button
          className="p-2 bg-red-500 text-white"
          type="button"
          severity="danger"
          onClick={() => setVisible(false)}
        >
          Hủy
        </Button>
        <Button
          className="p-2 bg-blue-500 text-white"
          type="submit"
          onClick={handleAddTestCase}
        >
          Thêm
        </Button>
      </div>
    </Dialog>
  );
};

export default AddTestCase;
