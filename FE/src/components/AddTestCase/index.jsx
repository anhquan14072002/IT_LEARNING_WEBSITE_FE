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
  const [total, setTotal] = useState(0);
  const [values, setValues] = useState([""]);
  const [target, setTarget] = useState("");
  const [output, setOutput] = useState("");
  const [isVisible, setIsVisible] = useState(true);

  // Handle the change in the total value
  const handleTotalChange = (e) => {
    let newTotal = parseInt(e.target.value, 10) || 0; // Default to 1 if input is empty
    newTotal = Math.max(0, Math.min(newTotal, 10)); // Ensure value is between 1 and 10

    setTotal(newTotal);
    setValues((prevValues) => {
      if (prevValues.length < newTotal) {
        // Add new inputs if the total increased
        return [...prevValues, ...Array(newTotal - prevValues.length).fill("")];
      } else {
        // Remove excess inputs if the total decreased
        return prevValues.slice(0, newTotal);
      }
    });
  };

  // Handle the change in each input value
  const handleInputChange = (index, e) => {
    const newValues = [...values];
    newValues[index] = e.target.value;
    setValues(newValues);
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

    const formattedValues = values.join(" ");
    let input;

    if (total > 0) {
      if (target) {
        console.log("====================================");
        console.log(total + " " + formattedValues + " " + target);
        console.log("====================================");
        input = total + " " + formattedValues + " " + target;
      } else {
        console.log("====================================");
        console.log(total + " " + formattedValues);
        console.log("====================================");
        input = total + " " + formattedValues;
      }
    } else {
      input = null;
    }
    console.log("====================================");
    console.log(output);
    console.log("====================================");
    setTestCaseList([...testCase, { input, output, visible: isVisible }]);
    setVisible(false);
    setTotal(0);
    setValues([""]);
    setTarget("");
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
        <h1>Độ dài mảng giá trị</h1>
        <input
          type="number"
          className="w-full p-2 border border-gray-400 rounded-lg"
          min="1"
          max="10"
          value={total}
          onChange={handleTotalChange}
        />
      </div>
      {total > 0 &&
        values.map((value, index) => (
          <div key={index} className="mb-3">
            <label className="block mb-1">Giá trị {index + 1}</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-400 rounded-lg"
              value={value}
              onChange={(e) => handleInputChange(index, e)}
            />
          </div>
        ))}
      <div className="mb-5">
        <h1>Target</h1>
        <input
          type="text"
          className="w-full p-2 border border-gray-400 rounded-lg"
          value={target}
          onChange={(e) => setTarget(e.target?.value)}
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
            setIsVisible(!isVisible)
          }}
        />
        <label className="ml-2">Test case này có hiển thị không?</label>
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
